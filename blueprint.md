# Project Blueprint

## Overview

This project was initially a lottery number generator. It has been repurposed to display information about exploring a haunted house, including a video and safety precautions, based on user-provided text.

## Style, Design, and Features

### Version 1: Lotto Number Generator

*   **Functionality:** Generates 6 unique random numbers between 1 and 45.
*   **Layout:** A simple, centered layout.
*   **Styling:** A modern, dark theme.

### Version 2: Haunted House Info Site

*   **Functionality:** Displays information about a haunted house location, including an embedded YouTube video and important safety warnings.
*   **Layout:** A single-page layout with a clear title, embedded video, and a prominent section for safety precautions.
*   **Styling:** A dark, spooky, and atmospheric theme. Important warnings are highlighted in red. The design is responsive and uses a thematic font from Google Fonts.
*   **Technology:** HTML and CSS. JavaScript has been cleared.

## Current Plan

**Request:** "이걸 기준으로 사이트를 만들어줘야지" (Translate: "You have to make a site based on this") - referring to the `haunted_house_info.txt` content.

**Plan:**

1.  **Update `index.html`:**
    *   Change the page title to "폐가 탐험 안내" (Haunted House Exploration Guide).
    *   Add a main heading and the introductory text.
    *   Embed the YouTube video using the correct `embed` URL.
    *   Create a section for "주의사항" (Precautions) with a prominent title.
    *   List the four safety rules with `<strong>` tags for emphasis.
    *   Add the concluding message.
2.  **Update `style.css`:**
    *   Import a thematic font ('Creepster') from Google Fonts.
    *   Apply a dark, atmospheric theme with a new background color (`#0a0a0a`).
    *   Use the new font for headings.
    *   Style the main container, center the content, and set a max-width for readability.
    *   Style the video container to be responsive.
    *   Make the "주의사항" title stand out in red.
    *   Style the list of precautions for clarity.
3.  **Update `main.js`:**
    *   Remove the previous lottery number generation logic by clearing the file.
