---
title: Tooltip
description: Description here
---

## Creating the Tooltips

This should give you the basics for creating a Soho styled lightbox in Pendo. The styles will correlate to `<h1>`, `<p>`, and any `<button class="custom-button">` tags.

Screenshots:
<img src="/img/tooltips.png" alt=""/>


The following is a basic scenario template to give you a title and subtext as described above.

||Example Variables||Example HTML||
|<img src="/img/tooltips-config.png" alt=""/>)|<img src="/img/tooltips-html.png" alt=""/>)|


> Note: If you want to create a tooltip template without the button:
> - Do not add a "button text" variable
> - Do not add the `<button class="custom-button"></button>` tag in the html.

{{> _cssCode cssStr=tooltipCss}}
