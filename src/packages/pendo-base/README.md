---
title: Base
description: Description here
---

## HTML Cheatsheet

### Basic Text Formatting

These are a few basic html tags that can be used to change the look of text. The first 3 are native and the last one is a custom one created to change to Infor’s designated "alert red" color.

<table>
    <thead>
        <tr>
            <th>Example</th>
            <th>Preview</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>This is `<strong>important</strong>`.</td>
            <td>This is <strong>important</strong>.</td>
        </tr>
        <tr>
            <td>This is `<em>emphasized</em>`.</td>
            <td>This is <em>emphasized</em>.</td>
        </tr>
        <tr>
            <td>This is line 1.`<br>`This is line 2.</td>
            <td>This is line 1.<br>This is line 2.</td>
        </tr>
        <tr>
            <td>This is a `<span class="red-text">red word</span>`.</td>
            <td>This is a <span class="red-text">red word</span>.</td>
        </tr>
    </tbody>
</table>

### Lists

An ordered list tag (`<ol>`) uses numbers for each item. An unordered list tag (`<ul>`) uses filled in circles for each item.

<table>
    <thead>
        <tr>
            <th>Example</th>
            <th>Preview</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                ```html
                <ol>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ol>
                ```
            </td>
            <td>
                <ol>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ol>
            </td>
        </tr>
        <tr>
            <td>
                ```html
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
                ```
            </td>
            <td>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
