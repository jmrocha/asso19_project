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

## Starting Diagram

![Starting Diagram](https://github.com/jmrocha/asso19_project/blob/master/diagram.png?raw=true)

## Decision Points

### REPL
We want to be able to execute commands like:
```
draw rect 10 10 10 10   // draws a rectangle at point (10, 10) with width 10 and height 10
draw circle 10 10 10    // draws a square at point (10, 10) with radius 10
remove obj 3            // removes object with id 3
remove doc 2            // removes document with id 3
undo
redo
checkout 5          // moves to state with id 5
export json         // exports current state in JSON format
export xml          // exports current state in XML format
show history        // outputs all the operations done
show objects        // outputs drawn objects ids
show documents      // outputs created documents ids
translate 2 10 15   // Performs a translation (10, 15) in object 2
rotate 2 90 y       // Performs a rotation of 90 deg in object 2
create document     // Creates a new document
use 2               // Use the document with id 2
```
And to support concatenation of operations such as:
```
draw rect 10 10 10 and draw circle 10 10 10 and export json
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
The **Interpreter pattern** tells us how to solve this kind of problem.
