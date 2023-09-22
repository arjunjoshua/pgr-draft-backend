# PGR Backend

## Overview

This API is designed to manage Pokémon lobbies, trainers, teams, and matches. It provides endpoints for various operations like listing all lobbies, getting details of a specific lobby, recording match results, and managing Pokémon teams.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [List All Lobbies](#list-all-lobbies)
  - [Get Lobby by ID](#get-lobby-by-id)
  - [Get Lobby Scores](#get-lobby-scores)
  - [Add Pokémon to Team](#add-pokémon-to-team)
  - [Record Match Result](#record-match-result)
  - [Remove Pokémon from Team](#remove-pokémon-from-team)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Installation

\`\`\`bash
# Clone the repository
git clone <repository_url>

# Navigate to the project directory
cd <project_name>

# Install dependencies
npm install
\`\`\`

## Usage

### List All Lobbies

**Endpoint**: `GET /lobbies`

**Response**: A JSON array of all lobbies.

### Get Lobby by ID

**Endpoint**: `GET /lobby/{lobbyID}`

**Parameters**: `lobbyID` - The ID of the lobby.

**Response**: A JSON object containing the lobby details and associated trainers.

### Get Lobby Scores

**Endpoint**: `GET /lobby/lobbyScore?lobbyID=<lobbyID>`

**Parameters**: `lobbyID` - The ID of the lobby.

**Response**: A JSON object containing the scores of trainers in the lobby.

### Add Pokémon to Team

**Endpoint**: `POST /addPokemon`

**Request Body**: 
\`\`\`json
{
  "teamID": "<team_id>",
  "pokemonName": "<pokemon_name>"
}
\`\`\`

**Response**: A message indicating the Pokémon has been added.

### Record Match Result

**Endpoint**: `POST /recordResult`

**Request Body**: 
\`\`\`json
{
  "trainer1ID": "<trainer1_id>",
  "trainer2ID": "<trainer2_id>",
  "winner": "<winner_id>",
  "winnerName": "<winner_name>",
  "lobbyID": "<lobby_id>"
}
\`\`\`

**Response**: A message indicating the match result has been recorded.

### Remove Pokémon from Team

**Endpoint**: `POST /removePokemon`

**Request Body**: 
\`\`\`json
{
  "teamID": "<team_id>",
  "pokemonName": "<pokemon_name>"
}
\`\`\`

**Response**: A message indicating the Pokémon has been removed.

## Error Handling

The API returns appropriate HTTP status codes along with error messages in a JSON format.

## Contributing

Feel free to fork the project and submit a pull request with your changes!

## License

This project is licensed under the MIT License.

