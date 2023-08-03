#app.py
from flask import Flask, request, jsonify, send_file, json
from flask_cors import CORS
import pandas as pd
import os
import json
import time
import threading
import pandas as pd
from flask import Flask
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "Hello, world!", {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
    }

def form():
    # Set up Chrome options
    options = Options()
    options.add_argument("--headless")  # Run the browser in headless mode
    options.add_argument("--disable-gpu")  # Disable GPU acceleration

    # Set up the Selenium service
    selenium_service = Service("path/to/chromedriver.exe")  # Replace with the path to your chromedriver executable
    driver = webdriver.Chrome(service=selenium_service, options=options)

    # Navigate to the website
    url = "https://www.fantasyfootballpundit.com/fpl-player-form-table-live-data/"
    driver.get(url)

    # Set up variables for scraping
    player_data = {}

    # Counter to keep track of pages scraped
    page_counter = 0
    timeout_limit = 5

    while page_counter < 70:
        try:
            # Wait for the table to load
            table_locator = (By.XPATH, "/html/body/div[2]/div/main/article/div/div/div/div/div/div/table/tbody")
            WebDriverWait(driver, timeout_limit).until(EC.presence_of_element_located(table_locator))

            # Find the table rows
            table = driver.find_element(*table_locator)
            rows = table.find_elements(By.TAG_NAME, "tr")

            for row in rows:
                cells = [cell.text for cell in row.find_elements(By.TAG_NAME, "td")]
                if len(cells) >= 7:
                    player_name = cells[0]
                    player_attributes = {
                        "Team": cells[1],
                        "Position": cells[2],
                        "Price": cells[3],
                        "Pick %": cells[4],
                        "Points": cells[5],
                        "Last 6": cells[6]
                    }
                    player_data[player_name] = player_attributes

            page_counter += 1

            # Scroll to the "Next" button
            next_button_locator = (By.CSS_SELECTOR, "#diff_next")
            next_button = driver.find_element(*next_button_locator)
            driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
            time.sleep(0.1)  # Wait for the scrolling animation to complete

            # Click on the "Next" button using JavaScript
            driver.execute_script("arguments[0].click();", next_button)

        except Exception as e:
            print("Exception occurred:", str(e))
            break

    # Quit the browser
    driver.quit()

    # Write the player_data dictionary to a JSON file
    with open("form_data.json", "w") as f:
        json.dump(player_data, f)

def value():
    # Set up Selenium options
    options = Options()
    options.add_argument("--headless")  # Run the browser in headless mode
    options.add_argument("--disable-gpu")  # Disable GPU acceleration

    # Set up the Selenium service
    selenium_service = Service("path/to/chromedriver.exe")  # Replace with the path to your chromedriver executable
    driver = webdriver.Chrome(service=selenium_service, options=options)

    # Load the webpage
    url = "https://www.fantasyfootballpundit.com/fpl-best-value-players-points-per-million/"
    driver.get(url)

    # Wait for the table to load and all elements to be present
    wait = WebDriverWait(driver, 10)  # Adjust the wait time as needed
    table_rows = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#value tbody tr")))

    # Create a BeautifulSoup object from the page source
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # Find the table element
    table = soup.select_one("#value")

    # Extract the desired attribute headers
    headers = ["Name", "Team", "Position", "Points per Game", "Points per Million"]

    # Create a list to hold all rows of data
    all_rows = []

    # Extract the table rows from the first page
    for row in table.select("tbody tr"):
        row_data = [cell.text for cell in row.find_all("td")]
        player_data = [row_data[0], row_data[1], row_data[2], row_data[5], row_data[7]]  # Select desired attributes
        all_rows.append(player_data)

    # Find the "Next" button
    next_button = driver.find_element(By.ID, "value_next")
    options.page_load_strategy = "none"

    # Counter to keep track of pages scraped
    page_counter = 1

    while next_button.is_enabled() and page_counter < 70:
        # Scroll to the "Next" button
        driver.execute_script("arguments[0].scrollIntoView(true);", next_button)

        # Click on the "Next" button using JavaScript
        driver.execute_script("arguments[0].click();", next_button)

        # Wait for the table to load and all elements to be present
        table_rows = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#value tbody tr")))

        # Create a new BeautifulSoup object from the page source
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Find the table element on the current page
        table = soup.select_one("#value")

        # Extract the table rows from the current page
        for row in table.select("tbody tr"):
            row_data = [cell.text for cell in row.find_all("td")]
            player_data = [row_data[0], row_data[1], row_data[2], row_data[5], row_data[7]]  # Select desired attributes
            all_rows.append(player_data)

        # Find the "Next" button for the next iteration
        next_button = driver.find_element(By.ID, "value_next")

        # Increment the page counter
        page_counter += 1

    # Quit the browser
    driver.quit()

    # Create a dictionary for each player with attribute names as keys and values
    players_data = [{header: player[i] for i, header in enumerate(headers)} for player in all_rows]

    # Write the player_data list to a JSON file
    with open("value_data.json", "w") as f:
        json.dump(players_data, f)

def merge_jsons():
    # Load the two JSON files
    with open("form_data.json", "r") as f:
        form_data = json.load(f)

    with open("value_data.json", "r") as f:
        value_data = json.load(f)

    # Create a dictionary to store the merged data
    merged_data = {}

    # Merge the form_data into the merged_data dictionary
    for player, attributes in form_data.items():
        name = player.upper()
        merged_data[name] = {
            "Team": attributes["Team"],
            "Position": attributes["Position"],
            "Price": attributes["Price"],
            "Pick %": attributes["Pick %"],
            "Points": attributes["Points"],
            "Last 6": attributes["Last 6"],
            "Points per Game": 0,
            "Points per Million": 0
        }

    # Merge the value_data into the merged_data dictionary
    for player in value_data:
        name = player["Name"].upper()
        if name in merged_data:
            merged_data[name].update({
                "Points per Game": player.get("Points per Game", 0),
                "Points per Million": player.get("Points per Million")
            })

    # Save the dictionary to a file
    with open("merged_data.json", "w") as f:
        json.dump(merged_data, f)
        

@app.route('/run-table', methods=['GET'])
def run_table1():
    # Create two threads
    form_thread = threading.Thread(target=form)
    value_thread = threading.Thread(target=value)

    # Start the threads
    form_thread.start()
    value_thread.start()

    # Wait for the threads to finish
    form_thread.join()
    value_thread.join()

    # Merge the JSON files
    merge_jsons()

    return "Done"
    return jsonify({'data': 'This is the run-table endpoint'}) 



@app.route('/calculate', methods=['POST'])
def final_data1():
    payload = request.get_json()

    team = payload['team']
    points_per_million = float(payload['value'])
    points_per_game = float(payload['efficiency'])
    recent_form = float(payload['form'])
    differential = float(payload['differential'])
    position = payload['position']
    budget = float(payload['budget'])
    team_support = float(payload['teamSupport'])

    def min_max_normalize(value, min_val, max_val):
        if min_val == max_val:
            normalized_value = 0.0  # Handle division by zero when min_val equals max_val
        else:
            normalized_value = (value - min_val) / (max_val - min_val)
        return normalized_value
    
    def normalize_pick_pct(value):
        pick_pct_cap = 3
        if value < pick_pct_cap:
            return pick_pct_cap
        else:
            return value

    final_scores = []
    normalized_scores = []

    with open("merged_data.json", "r") as file:
        merged_data = json.load(file)

    if position != "ANY":
        merged_data = {k: v for k, v in merged_data.items() if v["Position"] == position}

    prices = []
    ppgs = []
    ppms = []
    forms = []
    pick_pcts = []
    point_values = []

    for player, data in merged_data.items():
        price = float(data['Price'])
        ppg = float(data['Points per Game'])
        ppm = float(data['Points per Million'])
        form = float(data['Last 6'])
        pick_pct = float(data['Pick %'])
        points = float(data['Points'])

        prices.append(price)
        ppgs.append(ppg)
        ppms.append(ppm)
        forms.append(form)
        pick_pcts.append(pick_pct)
        point_values.append(points)

    min_price = min(prices)
    max_price = max(prices)
    min_ppg = min(ppgs)
    max_ppg = max(ppgs)
    min_ppm = min(ppms)
    max_ppm = max(ppms)
    min_form = min(forms)
    max_form = max(forms)
    min_pick_pct = min(pick_pcts)
    max_pick_pct = max(pick_pcts)
    min_points = min(point_values)
    max_points = max(point_values)

    for player, data in merged_data.items():
        team = data['Team']
        price = float(data['Price'])
        ppg = float(data['Points per Game'])
        ppm = float(data['Points per Million'])
        form = float(data['Last 6'])
        pick_pct = float(data['Pick %'])
        points = float(data['Points'])

        pick_pct = normalize_pick_pct(pick_pct)

        normalized_ppg = min_max_normalize(ppg, min_ppg, max_ppg)
        normalized_ppm = min_max_normalize(ppm, min_ppm, max_ppm)
        normalized_form = min_max_normalize(form, min_form, max_form)
        normalized_pick_pct = min_max_normalize(pick_pct, min_pick_pct, max_pick_pct)
        normalized_points = min_max_normalize(points, min_points, max_points)

        weighted_ppg = normalized_ppg * points_per_game
        weighted_ppm = normalized_ppm * points_per_million
        weighted_form = normalized_form * recent_form
        weighted_differential = (1 - normalized_pick_pct) * differential

        team_support_boost = team_support
        final_score = 0

        if team != team:
            team_support_boost = 0

        if price <= budget:
            final_score = (
                weighted_ppg
                + (1.5 * weighted_ppm)
                + weighted_form
                + (0.6 * team_support_boost)
                + (0.5 * weighted_differential)
                + (0.7 * normalized_points)
            )
        else:
            final_score = 3

        final_scores.append(final_score)

        print(f"Player: {player}")
        print(f"Price: {price}")
        print(f"PPG: {ppg}")
        print(f"PPM: {ppm}")
        print(f"Form: {form}")
        print(f"Pick Pct: {pick_pct}")
        print(f"Points: {points}")
        print(f"Final Score: {final_score}")
        print("------------------------------")    

    for final_score in final_scores:
        normalized_final_score = 100 * min_max_normalize(final_score, min(final_scores), max(final_scores))
        normalized_final_score = round(normalized_final_score, 2)
        normalized_scores.append(normalized_final_score)

    for index, value in enumerate(final_scores):
        merged_data[list(merged_data.keys())[index]]["Score"] = normalized_scores[index]

    print("merged_data:", merged_data)  # Check the updated merged_data dictionary

    with open("final_scores.json", "w") as file:
        json.dump(merged_data, file)

    return send_file("final_scores.json", as_attachment=True)

@app.route('/merged_data.json', methods=['GET'])
def get_merged_data():
    file_path = os.path.join(os.path.dirname(__file__), 'merged_data.json')
    return send_file(file_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)    