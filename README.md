# Codingame Unleash the Geek Competition

## What is this project for?

This is my bot for the 10 days Unleash the Geek competition. Its a 1v1 game where you have to collect more ore than your opponent given a set amount of turns.

## Rules

Visit: `https://www.codingame.com/ide/challenge/unleash-the-geek-amadeus`

# Highlights of the game strategy

## Heatmap

Every turn the bot updates the game state and geneates several heatmaps of the followings:

- allied robots
- enemy robots
- holes
- ore (discovered)
- radars
- traps

Then `the heatmap is used by the bot to pick areas of interests` dependent on the action it is assigning to robots

## Managing the robots

Originally I intended to write a utility AI instead of writing a behaviour tree or finite state machine (which is what I did for the Halite 3 competition), but given that I never implemented such a system before and the limited time I had to work on this project I ended up creating a hybrid solution, where the AI is primarily a behaviour tree that uses three distances (robot-headquarters, target-headquarters, robot-target) to calculate utility.

Basically what the AI does is that it `performs a series of checks` (is the robot's cargo empty, is radar available, is there ore nearby etc...), `factors in the distances to performa those actions, and then selects an action` (pick up radar, harvest ore, randomly dig a hole to discover ore etc...) to execute.

## Managing radars

At the beginning of the game the bot pre-computes areas that minimizes radars overlapping each other and every time when there is a radar available using the heatmap and distances it picks a location for the next radar to deploy.

## Managing traps

One of the factors that makes this competition tricky is that the robots can lay traps that can explode and destroy your robots.

In order to avoid that I added a PlayerMemory class that checks whether an enemy bot stayed in place and dug a hole for the turn. `If yes the bot marked that cell as dangerous` (there is the possibility of a trap being there), so I avoid digging on those cells.

# Summary

Unfortunately this bot only allowed me to get to the Silver League (out of Bronze, Silver, Gold, Legend). it was a useful learning experience and there are definitely

## Parts of the code that I am proud of

- The code that updates the map with the current state, particularly the `heatmap`
- The algorithm that makes the robots dig holes if they got nothing better to do, so the areas of interest become more clear
- The trap avoiding algorithm (the reason I got to Silver)

## Parts of the code that I am dissatisfied with

- The algorithm that deploys the radars (rate and locations)
- Could not find the bug that sometimes makes the robots wander the wrong direction (interpretation of the heatmap)
- Could not develop a proper utility AI and the limitations show
- Had to tie together some of the classes in the AI that makes understanding the code difficult
