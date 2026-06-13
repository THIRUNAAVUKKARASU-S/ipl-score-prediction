import os
import random
import pandas as pd
import numpy as np

# Configure random seed for reproducibility
random.seed(42)
np.random.seed(42)

# Configuration for IPL Simulation
venues = [
    "M Chinnaswamy Stadium",
    "Wankhede Stadium",
    "MA Chidambaram Stadium",
    "Eden Gardens",
    "Narendra Modi Stadium",
    "Arun Jaitley Stadium",
    "Rajiv Gandhi International Stadium",
    "Punjab Cricket Association IS Bindra Stadium"
]

teams = [
    "Chennai Super Kings",
    "Mumbai Indians",
    "Royal Challengers Bangalore",
    "Kolkata Knight Riders",
    "Rajasthan Royals",
    "Delhi Capitals",
    "Sunrisers Hyderabad",
    "Punjab Kings"
]

# Team-specific strength factors (for scoring and bowling)
team_bat_strength = {
    "Chennai Super Kings": 1.05,
    "Mumbai Indians": 1.04,
    "Royal Challengers Bangalore": 1.08,  # High scoring, but high volatility
    "Kolkata Knight Riders": 1.02,
    "Rajasthan Royals": 1.01,
    "Delhi Capitals": 0.98,
    "Sunrisers Hyderabad": 0.99,
    "Punjab Kings": 0.96
}

team_bowl_strength = {
    "Chennai Super Kings": 0.98,  # lower is better (gives fewer runs)
    "Mumbai Indians": 0.97,
    "Royal Challengers Bangalore": 1.05,  # concedes more runs
    "Kolkata Knight Riders": 0.99,
    "Rajasthan Royals": 0.98,
    "Delhi Capitals": 1.01,
    "Sunrisers Hyderabad": 0.96,
    "Punjab Kings": 1.03
}

# Venue profiles: (avg_score_factor, avg_wicket_rate)
venue_profiles = {
    "M Chinnaswamy Stadium": (1.15, 0.95),      # High run rate, average wickets
    "Wankhede Stadium": (1.10, 1.00),           # Good batting track
    "MA Chidambaram Stadium": (0.88, 1.15),     # Spin-friendly, low scoring, high wickets
    "Eden Gardens": (1.02, 1.02),
    "Narendra Modi Stadium": (1.05, 0.98),
    "Arun Jaitley Stadium": (0.98, 1.05),
    "Rajiv Gandhi International Stadium": (1.00, 1.00),
    "Punjab Cricket Association IS Bindra Stadium": (1.02, 1.01)
}

# Player pools per team (simplification to make dropdown populate beautifully)
batsmen_by_team = {
    "Chennai Super Kings": ["MS Dhoni", "Ruturaj Gaikwad", "Shivam Dube", "Ravindra Jadeja", "Ajinkya Rahane"],
    "Mumbai Indians": ["Rohit Sharma", "Suryakumar Yadav", "Hardik Pandya", "Ishan Kishan", "Tilak Varma"],
    "Royal Challengers Bangalore": ["Virat Kohli", "Faf du Plessis", "Glenn Maxwell", "Dinesh Karthik", "Rajat Patidar"],
    "Kolkata Knight Riders": ["Shreyas Iyer", "Rinku Singh", "Andre Russell", "Venkatesh Iyer", "Sunil Narine"],
    "Rajasthan Royals": ["Jos Buttler", "Sanju Samson", "Yashasvi Jaiswal", "Riyan Parag", "Shimron Hetmyer"],
    "Delhi Capitals": ["Rishabh Pant", "David Warner", "Prithvi Shaw", "Tristan Stubbs", "Axar Patel"],
    "Sunrisers Hyderabad": ["Travis Head", "Abhishek Sharma", "Heinrich Klaasen", "Aiden Markram", "Nitish Kumar Reddy"],
    "Punjab Kings": ["Shikhar Dhawan", "Liam Livingstone", "Jitesh Sharma", "Sam Curran", "Shashank Singh"]
}

bowlers_by_team = {
    "Chennai Super Kings": ["Ravindra Jadeja", "Matheesha Pathirana", "Shardul Thakur", "Deepak Chahar", "Maheesh Theekshana"],
    "Mumbai Indians": ["Jasprit Bumrah", "Gerald Coetzee", "Piyush Chawla", "Hardik Pandya", "Akash Madhwal"],
    "Royal Challengers Bangalore": ["Mohammed Siraj", "Yash Dayal", "Lockie Ferguson", "Glenn Maxwell", "Karn Sharma"],
    "Kolkata Knight Riders": ["Mitchell Starc", "Sunil Narine", "Varun Chakaravarthy", "Harshit Rana", "Andre Russell"],
    "Rajasthan Royals": ["Yuzvendra Chahal", "Ravichandran Ashwin", "Trent Boult", "Avesh Khan", "Sandeep Sharma"],
    "Delhi Capitals": ["Kuldeep Yadav", "Anrich Nortje", "Khaleel Ahmed", "Axar Patel", "Mukesh Kumar"],
    "Sunrisers Hyderabad": ["Pat Cummins", "Bhuvneshwar Kumar", "T Natarajan", "Mayank Markande", "Jaydev Unadkat"],
    "Punjab Kings": ["Kagiso Rabada", "Arshdeep Singh", "Harshal Patel", "Rahul Chahar", "Sam Curran"]
}

def simulate_innings(venue, bat_team, bowl_team):
    """
    Simulates a single IPL first innings ball-by-ball.
    Returns a list of match state dictionaries at various points.
    """
    bat_factor = team_bat_strength[bat_team]
    bowl_factor = team_bowl_strength[bowl_team]
    venue_bat, venue_bowl = venue_profiles[venue]
    
    # Combined probabilities
    # Base run rate is around 8.0 per over (1.33 runs per ball)
    run_rate_multiplier = bat_factor * bowl_factor * venue_bat
    wicket_rate_multiplier = venue_bowl * (1.0 / bat_factor) * bowl_factor
    
    # Event distributions
    # Probability of events per ball:
    # 0 runs: 0.35, 1 run: 0.40, 2 runs: 0.08, 3 runs: 0.01, 4 runs: 0.10, 6 runs: 0.04, wicket: 0.02
    p_wicket = 0.028 * wicket_rate_multiplier
    p_six = 0.045 * run_rate_multiplier
    p_four = 0.105 * run_rate_multiplier
    p_dot = 0.35 / run_rate_multiplier
    p_single = 0.40
    p_double = 0.07
    
    # Normalize probabilities
    probs = np.array([p_dot, p_single, p_double, 0.01, p_four, p_six, p_wicket])
    probs = np.clip(probs, 0.001, 0.999)
    probs /= probs.sum()
    
    events = [0, 1, 2, 3, 4, 6, 'W']
    
    # Initialize match state
    total_runs = 0
    wickets = 0
    ball_count = 0
    
    # Active players
    batting_lineup = batsmen_by_team[bat_team].copy()
    random.shuffle(batting_lineup)
    bowler_list = bowlers_by_team[bowl_team].copy()
    
    # Current batsmen in play (striker, non-striker)
    striker = batting_lineup[0]
    non_striker = batting_lineup[1]
    next_bat_idx = 2
    
    striker_runs = {striker: 0, non_striker: 0}
    
    # Current bowler
    current_bowler = random.choice(bowler_list)
    
    snapshots = []
    
    # Simulate 120 balls (20 overs)
    for over_num in range(20):
        # Change bowler every over
        available_bowlers = [b for b in bowler_list if b != current_bowler]
        current_bowler = random.choice(available_bowlers)
        
        for ball_num in range(6):
            if wickets >= 10:
                break
                
            ball_count += 1
            event = np.random.choice(events, p=probs)
            
            # Form decimal overs representation
            overs_completed = over_num + (ball_num + 1) / 10.0
            # Wait, 10.6 overs is represented as 11.0. Let's handle it
            if ball_num == 5:
                overs_completed = float(over_num + 1)
            
            if event == 'W':
                wickets += 1
                # Striker gets out
                striker_runs[striker] = striker_runs.get(striker, 0)
                if wickets < 10 and next_bat_idx < len(batting_lineup):
                    # New batsman comes in
                    striker = batting_lineup[next_bat_idx]
                    next_bat_idx += 1
                    striker_runs[striker] = 0
            else:
                run_val = int(event)
                total_runs += run_val
                striker_runs[striker] = striker_runs.get(striker, 0) + run_val
                
                # Single or three runs changes strike
                if run_val in [1, 3]:
                    striker, non_striker = non_striker, striker
            
            # Capture snapshots periodically (e.g. every over starting from over 5, or randomly)
            # Avoid capturing too close to the start (overs < 5) to ensure model has historical momentum
            if over_num >= 5 and wickets < 10 and ball_num == 5:
                # Store snapshot
                snapshots.append({
                    'venue': venue,
                    'bat_team': bat_team,
                    'bowl_team': bowl_team,
                    'runs': total_runs,
                    'wickets': wickets,
                    'overs': overs_completed,
                    'striker': striker_runs.get(striker, 0),
                    'batsman': striker,
                    'bowler': current_bowler
                })
        
        # Innings ends if all out
        if wickets >= 10:
            break
            
    # Add final score to all snapshots of this innings
    final_score = total_runs
    for snap in snapshots:
        snap['final_score'] = final_score
        
    return snapshots

def generate_dataset(num_matches=5000):
    all_data = []
    print(f"Simulating {num_matches} matches...")
    for i in range(num_matches):
        venue = random.choice(venues)
        bat_team = random.choice(teams)
        bowl_team = random.choice([t for t in teams if t != bat_team])
        
        match_snaps = simulate_innings(venue, bat_team, bowl_team)
        all_data.extend(match_snaps)
        
    df = pd.DataFrame(all_data)
    # Ensure directories exist
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/ipl_data.csv', index=False)
    print(f"Dataset generated with {len(df)} rows. Saved to 'data/ipl_data.csv'.")

if __name__ == '__main__':
    generate_dataset(5000)
