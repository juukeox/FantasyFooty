# algorithm.py
'''

from flask import Flask, request, jsonify, send_file
import pandas as pd
import os
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the final_data function
@app.route('/calculateee', methods=['POST'])
def final_data2(position, team_support, points_per_million, points_per_game, team, recent_form, differential, budget):

    payload = request.get_json()

    position = payload['position']
    team_support = payload['team_support']
    points_per_million = payload['points_per_million']
    points_per_game = payload['points_per_game']
    team = payload['team']
    recent_form = payload['recent_form']
    differential = payload['differential']
    budget = payload['budget']
    
    # Define the min-max normalization function
    def min_max_normalize(value, min_val, max_val):
        normalized_value = (value - min_val) / (max_val - min_val)  # Normalize between 0 and 1
        return normalized_value

    def normalize_pick_pct(value):
        # Set the cap value for pick_pct
        pick_pct_cap = 3
        if value < pick_pct_cap:
            return pick_pct_cap
        else:
            return value

    # Load the merged data from the "merged_data.json" file
    merged_df = pd.read_json("merged_data.json")

    final_scores = []
    normalized_scores = []

    if position != "ANY":
        merged_df = merged_df[merged_df['Position'] == position]

    for _, row in merged_df.iterrows():
        price = row['Price']
        ppg = row['Points per Game']
        ppm = row['Points per Million']
        form = row['Last 6']
        pick_pct = row['Pick %']
        points = row['Points']

        pick_pct = normalize_pick_pct(pick_pct)

        normalized_ppg = min_max_normalize(ppg, merged_df['Points per Game'].min(), merged_df['Points per Game'].max())
        normalized_ppm = min_max_normalize(ppm, merged_df['Points per Million'].min(), merged_df['Points per Million'].max())
        normalized_form = min_max_normalize(form, merged_df['Last 6'].min(), merged_df['Last 6'].max())
        normalized_pick_pct = min_max_normalize(pick_pct, merged_df['Pick %'].min(), merged_df['Pick %'].max())
        normalized_points = min_max_normalize(points, merged_df['Points'].min(), merged_df['Points'].max())

        weighted_ppg = normalized_ppg * points_per_game
        weighted_ppm = normalized_ppm * points_per_million
        weighted_form = normalized_form * recent_form
        weighted_differential = (1 - normalized_pick_pct) * differential

        team_support_boost = 0
        final_score = 0

        if row['Team'] == team_support:
            team_support_boost = team_support
        else:
            team_support_boost = 0

        if price <= budget:
            final_score = weighted_ppg + (1.5 * weighted_ppm) + weighted_form + (0.6 * team_support_boost) + (0.5 * weighted_differential) + (0.7 * normalized_points)
        else:
            final_score = 0

        final_scores.append(final_score)

    merged_df['Final Score'] = final_scores

    for _, row in merged_df.iterrows():
        final_score = row['Final Score']
        normalized_final_score = 100 * min_max_normalize(final_score, merged_df['Final Score'].min(), merged_df['Final Score'].max())
        normalized_final_score = round(normalized_final_score, 2)
        normalized_scores.append(normalized_final_score)

    merged_df['Score'] = normalized_scores

    # Capitalize all strings in the DataFrame
    merged_df = merged_df.applymap(lambda x: x.upper() if isinstance(x, str) else x)  #!!! is this necessary?

    # Sort the players based on final scores in descending order
    merged_df = merged_df.sort_values(by='Final Score', ascending=False)

    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

@app.route('/api/endpoint', methods=['POST'])
def handle_request1():
    data = request.json
    position = data['position']
    team_support = float(data['teamSupport'])
    points_per_million = float(data['value'])
    points_per_game = float(data['efficiency'])
    team = data['team']
    recent_form = float(data['form'])
    differential = float(data['differential'])
    budget = float(data['budget'])

    final_data1(position, team_support, points_per_million, points_per_game, team, recent_form, differential, budget)

    print('Request received:', data)  # Print the received data

    return jsonify({'result': 'Success'})

@app.route('/send', methods=['GET'])
def download_file1():
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
    filename = 'final_data.xlsx'
    file_path = os.path.join(output_dir, filename)

    return send_file(file_path, as_attachment=True, attachment_filename=filename)

'''