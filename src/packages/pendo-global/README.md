---
title: Global Styles
description: This will add the styles into your global stylesheet settings and configure different Pendo components.
---

## The CSS

To add/update the global css:

1. *Select* (triple clicking the text is easiest) the CSS code below and then *copy* it.

<iframe id="iframe-raw-css" src="./dist/global.min.css" scrolling="no"></iframe>

1. Go to your Pendo dashboard where you edit your guides.
1. *Click* on "Global Settings" in the top right corner.
1. In the popup window, *select* the “Global CSS” tab.
1. *Select* the radio button beside “Add Custom CSS”
1. *Click* the "Reset to Default" button to reset any previously custom styles.
1. *Scroll down* in the input box to where there is a comment block that says `Your Custom Classes/IDs` (all the way at the bottom).
1. *Paste* the copied CSS code underneath that comment block.
    - i.e. In the screenshot below you would paste on line 214.
    - <img src="assets/images/global-styles-config.png" class="img-sm" alt="Global styles config screenshot"/>
1. *Click* Save.


## Badge Configuration

The badge configuration should be as follows to match the Soho theme.

- Use the filled circle with the cutout `i` in the middle
- The hexadecimal color is `#e84f4f` (aka "soho-alert-red")

<table>
    <thead>
        <tr>
            <th>Preview</th>
        </tr>
    </thead>
    <tr>
        <td><img src="assets/images/badge-preview.png" alt="Bdage preview screenshot"/></td>
    </tr>
</table>


## Banner

This should give you the basics for creating a Soho-themed banner.

### Creating the Banner

General styles will correlate to any content that is placed in the banner aside from the bold text which can be explicitly done so with `<strong>` tags. The following is a basic scenario template to give you a description with some bold text.

<table>
    <thead>
        <tr>
            <th>Config Variables</th>
            <th>Config HTML</th>
        </tr>
    </thead>
    <tr>
        <td><img src="assets/images/banner-config.png" alt="Banner config screenshot"/></td>
        <td><img src="assets/images/banner-html.png" alt="Banner html screenshot"/></td>
    </tr>
</table>


### Banner preview

<img src="assets/images/banner.png" class="img-lg" alt="Example banner"/>


## Launcher Configuration

The launcher configuration should be as follows to match the Soho theme.

- Use the `?` with the empty circle icon
- The hexadecimal color is `#e84f4f` (aka "soho-alert-red")

<table>
    <thead>
        <tr>
            <th>Config</th>
            <th>Preview</th>
        </tr>
    </thead>
    <tr>
        <td><img src="assets/images/launcher-config.png" alt="Launcher Config screenshot"/></td>
        <td><img src="assets/images/launcher-preview.png" alt="Launcher preview"/></td>
    </tr>
</table>


## Lightbox

This should give you the basics for creating a Soho-themed lightbox.

### Creating the Lightbox

The styles will correlate to `<h1>`, `<p>`, and any `<button class="custom-button">` tags as seen by the preview to the right. The following is a basic scenario template to give you a title, body, and button.

<table>
    <thead>
        <tr>
            <th>Config Variables</th>
            <th>Config HTML</th>
        </tr>
    </thead>
    <tr>
        <td><img src="assets/images/lightbox-variables.png" alt="lightbox variables screenshot"/></td>
        <td><img src="assets/images/lightbox-html.png" alt="lightbox html screenshot"/></td>
    </tr>
</table>

### Lightbox Preview

<img src="assets/images/lightbox.png" class="img-md" alt="Lightbox preview"/>


## Tooltip

This should give you the basics for creating a Soho-themed tooltip.

### Creating the Tooltips

The styles will correlate to `<h1>`, `<p>`, and any `<button class="custom-button">` tags. The following is a basic scenario template to give you a title and subtext.

> Note: If you want to create a tooltip template without the button:
>
> - Do not add a "button text" variable
> - Do not add the `<button class="custom-button"></button>` tag in the html.

<table>
    <thead>
        <tr>
            <th>Config Variables</th>
            <th>Config HTML</th>
        </tr>
    </thead>
    <tr>
        <td><img src="assets/images/tooltip-variables.png" alt="Tooltip variables screenshot"/></td>
        <td><img src="assets/images/tooltip-html.png" alt="Tooltip html screenshot"/></td>
    </tr>
</table>

### Tooltip Preview

Your tooltips should look like these:

<img src="assets/images/tooltips.png" alt="Tooltip example screenshot"/>
