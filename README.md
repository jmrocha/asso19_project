# Simple Draw

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Getting started

Requirements:
- nodejs

Install the dependencies:
```bash
npm install
```

Run:
```
npm start
```

## Development
Having the dependencies installed, run:
```bash
npm run dev
```

## Functionalities

- SimpleDraw is based on the notion of documents;
- Documents are rendered either in SVG or HTMLCanvas;
- Multiple views of the same model;
- Two interaction modes: point-n-click and REPLs;
- Support persistence in multiple formats (TXT, XML, BIN);
- Extendible with different objects (triangles, arrows, ...);
- Extendible with new tools (rotate, translate, grid, ...);
- Support (un)limited Undo / Redo of all operations;
- Eventually extra funcionalities to be decided later.

## Collaborators

- Bruno Miguel;
- João Rocha;
- Sérgio Salgado.

## Logical View

### Application Class Diagram

![Application Class Diagram](https://www.plantuml.com/plantuml/img/VLHRJiCm4FptANA1z0G8jKeH4g8WDQNYT-iknLBYHFQMXyJXCOxjhfFGJy_ClYTPMW93vxOHGcb2ymOIYotg8neX6x2sgFVtsRi2_G4sG56Zshx1jO7FTIVFBMeAn0vDgpHasUjtw96zLv9KfsEgoY0GLih81WF3YIrA0drA71mi6P1KS96la0Nl36ZRE2f3N_Insu26avlaqiyV2eTHzLNVCybUMKKT3xhxwZj3jUk5yFGTWbutZxFuG_tyD2A4xxaeozkKF5SKDp-BnLLkMcrEDLVR3UShpvmnKkcG4GW6YC_9ED4rGs9_SkuS1ejfMS_ow_mZYTQPdDtDMfPpNhgg79ihATpUfixYxDXVhFSq2_DKChjlRLZ3WAGMmcv4M9UlSlaKEPfza8ED1fmbP_2aWbYwKFS7-0K0)

### Architecture Style
![Architecture Style](https://www.plantuml.com/plantuml/img/SoWkIImgAStDuUBYKW22jAB4t5G59UUSpDIy4YM5Qh0W24I7UiQ2ERKe2eDJYyfIYr0KXgScAK24uHguGBeLT7NjK6GLh1GyGa82WD8EgNafG3S00000)

## Decision Points

### REPL
We want to be able to execute commands such as:
```
draw rect 10 10 10 10   // draws a rectangle at point (10, 10) with width 10 and height 10
draw circle 10 10 10    // draws a square at point (10, 10) with radius 10
remove obj 3            // removes object with id 3
remove doc 2            // removes document with id 3
undo
redo
checkout 5                // moves to state with id 5
export json               // exports current state in JSON format
export xml                // exports current state in XML format
import /simple-draw.json  // imports document exported in JSON
show history              // outputs all the operations done
show objects              // outputs drawn objects ids
show documents            // outputs created documents ids
translate 2 10 15         // performs a translation (10, 15) in object 2
rotate 2 90 y             // performs a rotation of 90 deg in object 2
create document           // creates a new document
use 2                     // use the document with id 2
render SVG                // change render to SVG
help                      // shows possible commands
```
And to support concatenation of operations such as:
```
draw rect 10 10 10 10 and draw circle 10 10 10 and export json
```

The problem is how to parse this commands in a way that the code stays readable,
extendible, maintainable and robust.

Since we have a considerable amount of commands, and even more, they can be combined, a good way to manage the complexity of interpreting all the possible commands is by defining a grammar.
At this stage, we think that the following grammar rules cover a reasonable amount
of functionality for our system:
```
expr -> term and expr | term
term -> draw | remove | 'redo' | 'undo' | show | transformation | use
use -> 'use' document_id
transformation -> 'translate' obj_id x y | 'rotate' obj_id deg axis
deg -> float
axis -> 'x' | 'y' | 'z'
show -> 'show history' | 'show objects'
draw -> ‘draw’ draw_shape
remove -> ‘remove’ remove_obj obj_id
remove_obj -> 'shape' | 'doc'
draw_shape -> shape center size | shape center radius
shape -> 'rect' | 'circle'
center -> float float
size-> width height
document_id -> int
obj_id -> int
width -> float
height -> float
radius -> float
int -> [0-9]+
float -> [0-9]+\.[0-9]+
```

The **Interpreter pattern** tells us how to solve this kind of problem:

![Pattern Diagram](https://www.plantuml.com/plantuml/img/ZP912i8m44NtESM0cuhs1YuKwqvGgXSOwr0YILkIgGhgtQrjfJPDmMp2_7dv-HEoj8o6Iwq4IrO4yMQ_XRL2Qo6Ic1hKGk39ii648QdrLLjkxeM1Xu1gXGUf2qMHmLkK9wMcZC4Ef0QDAJkJ0LDljJJfEVuMmL--S-XvJclJMUKYinJeYgf4fg2jPLQK_4M8cvE1O_0IefdrSurdtWxuY0xGDNUdosWl9frVQRHz9ACzpPwqU8RX8A47SJDw42UfXnZczK1kQY6MrOjMl-iD)
