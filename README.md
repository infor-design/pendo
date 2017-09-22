# Pendo Soho Styleguide

This document is to help you apply Hook & Loop’s Soho styles to Pendo elements in your app/system. All of the styles and CSS code shown below was taken directly from the Soho controls library v4.2.5.

Example screenshots are also provided as a starting point to create your default Soho templates. Feel free to play around with the variables and HTML code to get your desired result.


## Table of Contents:
HTML Cheatsheet
- Basic Text Formatting
- Lists
Launcher Configuration
Badge Configuration
How To Add & Apply the Styles
- Method 1: Using Global Styles
- Method 2: CSS-per-Template
- Creating the Banner
- Creating the Lightbox
- Creating the Tooltips


How To Add & Apply the Styles

There are two ways you can update your styles to the Soho look and feel.

- Method 1 is to change the global stylesheet in Pendo by adding the corresponding CSS to the bottom of the Global Stylesheet.

*OR*

- Method 2 is to create a template for each type (banner, lightbox, or tooltip) and paste the corresponding CSS into the CSS tab of the template.


> Note: Choose only ONE method. Doing both is essentially doing the same thing twice and can get confusing due to redundancy.



## Method 1: Using Global Styles

> Note: Since there can be issues copying/pasting from a PDF document, I have also included a file in OneDrive with the raw global styles:  soho-pendo-templates-global-styles.css


To setup the global css:
- Click on Global Settings in the top right corner.
- In the popup window, select the "Global CSS."
- Select the bubble beside "Add Custom CSS"
- Copy and paste the following styles at the end everything already in the input box.

```html
/* ------------------------------
 * ----- SOHO Styles v4.2.6 -----
 * ------------------------------ */

._pendo-guide-container_ {
    border-radius: 2px;
}

._pendo-guide-container_ ._pendo-close-guide_ {
    /* Close guide icon */

    color: var(--graphite06); /* color is soho-var(--graphite06)*/
    display: inline;
    font-weight: 200;
    font-size: 28px;
    top: 6px;
    right: 15px;
}

._pendo-guide-container_ ._pendo-close-guide_:hover {
    /* Close guide icon hover effects*/

    color: var(--graphite10); /* color is soho-graphite10 */
}

._pendo-guide-banner-top_ ._pendo-guide-container_ {
    /* Guide border, shadow, background, etc. */

    /* border is soho-azure06 */
    border: solid 1px var(--azure06);
    /* bkgd is soho-azure01 */
    background-color: var(--azure01);
    border-radius: 2px;
    padding: 15px 0;
    margin: 5px auto 0 auto;
    width: 95%;
}

._pendo-guide-banner-top_ ._pendo-guide-container_ ._pendo-guide-content_ {
    /* Content area: use for font attributes, padding, etc. */
    text-align: center;
    padding: 0;
    color: var(--graphite10); /* color is soho-graphite10 */
    font-size: 14px;
}

._pendo-guide-banner-top_ ._pendo-guide-container_ ._pendo-close-guide_ {
    /* Close guide icon */

    color: var(--graphite06); /* color is soho-var(--graphite06)*/
    display: inline;
    font-weight: 200;
    font-size: 22px;
    top: 10px;
    right: 15px;
}

._pendo-guide-banner-top_ ._pendo-guide-container_ ._pendo-close-guide_:hover {
    /* Close guide icon hover effects*/

    color: var(--graphite10); /* color is soho-graphite10 */

}

._pendo-guide-container_ ._pendo-guide-content_ h1 {
    color: var(--graphite10); /* color is soho-graphite10 */
    font-size: 18px;
    font-weight: normal;
    padding: 20px 20px 2px;
}

._pendo-guide-container_ ._pendo-guide-content_ p,
._pendo-guide-container_ ._pendo-guide-content_ ol,
._pendo-guide-container_ ._pendo-guide-content_ ul {
    color: var(--graphite10);
    font-size: 14px;
    line-height: 20px;
    padding: 5px 20px;
    text-align: left;
}

._pendo-guide-container_ ._pendo-guide-content_ ul {
    list-style-type: disc;
    margin-left: 15px;
}

._pendo-guide-container_ ._pendo-guide-content_ ol {
    list-style-type: decimal;
    margin-left: 15px;
}

._pendo-guide-container_ ._pendo-guide-content_ p {
    margin: 10px 0;
}

._pendo-guide-container_ ._pendo-guide-content_ a {
    color: var(--azure06); /* color is soho-azure06 */
    text-decoration: none;
}

._pendo-guide-container_ ._pendo-guide-content_ .custom-button {
    background: var(--white);
    border: 0;
    border-top: solid 1px var(--graphite10);
    color: var(--azure06); /* color is soho-azure06 */
    cursor: pointer;
    display: block;
    font-family: inherit;
    font-size: 12px;
    font-weight: bold;
    height: 50px;
    line-height: 50px;
    text-align: center;
    text-transform: uppercase;
    width: 100%;
    white-space: nowrap;
}

._pendo-guide-container_ ._pendo-guide-content_ .custom-button:hover {
    color: var(--azure07);
}

._pendo-guide-container_ ._pendo-guide-content_ .red-text {
    color: var(--alert-red); /* color is soho red alert */
}
```

## Method 2: CSS-per-Template

### Banner CSS

You will need to copy and paste the following CSS into the CSS tab of your banner template.

BASECSS

### Lightbox CSS

You will need to copy and paste the following CSS into the CSS tab of your lightbox template.

CSS


### Tooltips CSS

You will need to copy and paste the following CSS into the CSS tab of your tooltip template.

CSS
