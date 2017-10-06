---
title: Global Styles
description: This will add the styles into your global stylesheet settings.
---

To add/update the global css:

1. Triple click (or highlight and drag) the CSS code below and copy it (right click -> copy OR ctrl+c).
    {{> _cssCode cssStr=globalCss}}
1. Go to your Pendo dashboard where you can edit guides.
1. Click on Global Settings in the top right corner.
1. In the popup window, select the “Global CSS” tab.
1. Select the radio button beside “Add Custom CSS”
1. Click the "Reset to Default" button to clear out any previously custom styles.
1. Scroll down in the input box to where there is a comment block that says `Your Custom Classes/IDs` (all the way at the bottom).
1. Paste (right click -> paste OR ctrl+v) the copied CSS code underneath that comment block (In the screenshot below you would paste on line 214).

<img src="images/global-styles-config.png" class="img-md" alt="Global styles config screenshot"/>
