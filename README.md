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

## Functionalities
- SimpleDraw is based on the notion of documents;
- Documents are rendered either in SVG or HTMLCanvas;
- Multiple views of the same model;
- Two interaction modes: point-n-click and REPLs;
- Support persistence in multiple formats (TXT, XML, BIN);
- Extendible with different objects (triangles, arrows, ...);
- Extendible with new tools (rotate, translate, grid, ...);
- Support (un)limited Undo / Redo of all operations;

## Authors

- Bruno Miguel;
- João Rocha;
- Sérgio Salgado.

## Logical View

### Application Class Diagram

![Application Class Diagram](https://www.plantuml.com/plantuml/png/VLHRJiCm4FptANA1z0G8jKeH4g8WDQNYT-iknLBYHFQMXyJXCOxjhfFGJy_ClYTPMW93vxOHGcb2ymOIYotg8neX6x2sgFVtsRi2_G4sG56Zshx1jO7FTIVFBMeAn0vDgpHasUjtw96zLv9KfsEgoY0GLih81WF3YIrA0drA71mi6P1KS96la0Nl36ZRE2f3N_Insu26avlaqiyV2eTHzLNVCybUMKKT3xhxwZj3jUk5yFGTWbutZxFuG_tyD2A4xxaeozkKF5SKDp-BnLLkMcrEDLVR3UShpvmnKkcG4GW6YC_9ED4rGs9_SkuS1ejfMS_ow_mZYTQPdDtDMfPpNhgg79ihATpUfixYxDXVhFSq2_DKChjlRLZ3WAGMmcv4M9UlSlaKEPfza8ED1fmbP_2aWbYwKFS7-0K0)

### Architecture Style
![Architecture Style](https://www.plantuml.com/plantuml/png/SoWkIImgAStDuUBYKW22jAB4t5G59UUSpDIy4YM5Qh0W24I7UiQ2ERKe2eDJYyfIYr0KXgScAK24uHguGBeLT7NjK6GLh1GyGa82WD8EgNafG3S00000)

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

![Pattern Diagram](https://www.plantuml.com/plantuml/png/ZP912i8m44NtESM0cuhs1YuKwqvGgXSOwr0YILkIgGhgtQrjfJPDmMp2_7dv-HEoj8o6Iwq4IrO4yMQ_XRL2Qo6Ic1hKGk39ii648QdrLLjkxeM1Xu1gXGUf2qMHmLkK9wMcZC4Ef0QDAJkJ0LDljJJfEVuMmL--S-XvJclJMUKYinJeYgf4fg2jPLQK_4M8cvE1O_0IefdrSurdtWxuY0xGDNUdosWl9frVQRHz9ACzpPwqU8RX8A47SJDw42UfXnZczK1kQY6MrOjMl-iD)

## Undo/Redo Actions

In SimpleDraw, we want users to be able to do a multitude of actions, such as creating various types of shapes and operate over them with algorithms such as translation, scale and rotation. In addition of performing such actions, users should be able to undo and redo these actions in the order they were performed. How should we design the program to perform these actions successfully? Our solution is that, by applying the **Command** pattern and it's respective characteristic functions (`do()` and `undo()`), we can be able to create a structure that supports the concept of performing actions in an easily scalable and maintainable format.

### Command Pattern

#### Problem in Context

Users of this software should be able to perform actions on the program. These actions can range from creating a simple rectangle to color an object on the document and can be done by the user by typing a command in a REPL or, if implemented, by pressing the mouse button. We can directly apply these actions inside the respective calls inside the REPL/mouse click, but what if, for example, we want to implement keyboard shortcuts to create objects? The call for the object creation we called before in the REPL/mouse click would also need to be done in each respective keybind. Adding the possibility of undoing and redoing an action to this mess would prove itself to be a nightmare...

#### Pattern Description

**Command** decouples the object that invokes the operation from the one that knows how to perform it. To achieve this separation, the designer creates an abstract base class that maps a receiver (an object) with an action (a pointer to a member function). The base class contains a `do()` method that simply calls the action on the receiver.

All clients of **Command** objects treat each object as a "black box" by simply invoking the object's virtual `do()` method whenever the client requires the object's "service".

#### Implementation Details

To implement this pattern we created an UndoManager that saves the encapsulated Command classes in do and undo stacks, for the undoing/redoing part of the design. For the actual Action classes, two Interfaces were created: the Action interface, which implements the `do()` method and is used to mostly perform actions that are not undoable, such as export/importing a document; the second interface, UndoableAction interface, extends the first and implements the `undo()` and `toJSON()` (used for broker messaging) method. This interface is used to perform undoable actions such as creating shapes and their respective transformations.

Implementation of the UndoableAction interface
```typescript
export interface UndoableAction<S> extends Action<S> {
  do(): S;
  undo(): void;
  toJSON(docID: number): string;
}
```

Implementation of an undoable Action
```typescript
export class TranslateAction implements UndoableAction<void> {
  oldCoordinates: Coordinate[] = [];

  constructor(
    private doc: SimpleDrawDocument, public shape: Shape, private xd: number, private yd: number
  ) {}

  do(): void {
    this.shape.coordinates.forEach(element => {
      this.oldCoordinates.push(new Coordinate(element.x, element.y));
    });

    this.shape.coordinates.forEach(element => {
      element.x += this.xd;
      element.y += this.yd;
    });
  }

  undo() {
    this.shape.coordinates = [...this.oldCoordinates];
  }

  toJSON(docID: number): string {
    return JSON.stringify({
      docID,
      type: 'TranslateAction',
      shape: JSON.stringify(this.shape),
      xd: this.xd,
      yd: this.yd,
    });
  }
}
```

#### Consequences

By implementing this feature we are able to construct and implement new actions to the system without messing with previous working code, greatly improving the code's readability and maintainability.
Also, by encapsulating each command into an Action object, implementing new ways of performing it is made way simpler, as we only need to call the Action object and the object takes care of the implementation by itself.

By using the **Command** pattern, features such as the multiuser take a hit on its ease of implementation as it would benefit if this feature was implemented with other patterns, such as Memento, due to the stateless broker used in the implementation of our multiuser.

### Multi-User Sessions

We want to be able for users to participate in multi-user sessions, where all changes made to the canvas are reflected in all users' screens. The main problem with implementing such feature is making sure that all screens stay syncronized and the ability to export the document is not hindered at any point, which can occour most likely due to mishandling the incoming packets.
In order to accomplish this, an implementation of a **publish-subscribe pattern** was implemented, thanks to the usage of a public MQTT broker that delegates the messages for the respective users through the use of websockets. Every user, when the session is opened, subscribes to a specific topic inside the broker, related to the session in question.
After this proof-of-concept was created, the group explored on how to make this use-case work in our favor. The syncronization of the sessions is accomplished by, whenever a user makes an action, a serialized string of the done action is sent to the broker, and each subscriber that is not the sender creates and executes the action, storing the reflection of the action in its own document, but not on the do/undo stacks, so that users cannot undo actions done by other users.

### Export/Import Feature

For this feature, we want the application to be able to support persistence of the data in more than one format. We also want the user to be able to import data to the application, which translates into objects to be drawn. 
Therefore, the application should be capable of exporting the objects created by the user to a file, which can be an XML file or a JSON file, and also capable of importing an XML or JSON file in order to load data to the program.

In order to solve this problem, the program must implement two algorithms, one for each of the types of file to be handled, both for the exporting and for the importing. Then, when the user requests the export or import feature, the correct algorithm must be selected to be executed. This problem was handled with the use of the **Strategy Pattern**.

Furthermore, when it comes to the export feature, it is necessary to analyse each object/shape drawn in the canvas and coherently transform it into data. Because each type of object/shape is different, it is necessary to process each object differently, based on its type. In order to solve this problem, we used the **Visitor Pattern**.

#### Strategy Pattern

According to Wikipedia, the "Strategy Pattern is a behavioral software design pattern that enables selecting an algorithm at runtime". Therefore, the Strategy pattern allows us to define a family of algorithms capable of doing a especific task, put them into separate classes, and make their objets interchangable.
So, both for the export and the import features, two different algorithms (classes) were implemented, one for the XML file type, and another for the JSON file type.

When it comes to implementation, at first, two simple classes were created, *Context* and *Strategy*, which can be seen bellow.

```typescript
export class Context {
  private strategy!: Strategy;

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  executeStrategy(objects: Shape[]) {
    return this.strategy.execute(objects);
  }
}
```


```typescript
export interface Strategy {
  execute(objects: Shape[]): void;
}
```

The *Context* class is a simple class that handles which algorithm to use and directs to its execution. The *Strategy* class has only an abstract *execute()* method, which is implemented by its subclasses *ConcreteStrategyXMLExp*, *ConcreteStrategyJSONExp*, *ConcreteStrategyXMLImp*, *ConcreteStrategyJSONImp*. These are the ones that end up defining the different algorithms to be used (which can be seen here: https://github.com/jmrocha/asso19_project/blob/feature/ImportAndExport/src/persistence/exporter.ts#L17).
This way, in order to perform, say, an export, it is only necessary to define the "strategy" to be used and then execute it, as seen in the below code:

```typescript
export(action: string) {
    const context = new Context();

    if (action === 'XML') {
      context.setStrategy(new ConcreteStrategyXMLExp());
    }
    if (action === 'JSON') {
      context.setStrategy(new ConcreteStrategyJSONExp());
    }

    context.executeStrategy(this.objects);
  }
```

When it comes to consequences, the **Stratey Pattern** brought advantages: it allowed us to swap between algorithms at runtime, it allowed us to isolate the implementation details of the algorithms from the code that uses it, and it also allows for extensibility purposes, as it is possible to introduce new strategies (algorithms) without having to change the context. As for disadvantages, because we only implemented two different algorithms (XML and JSON), one can argue that the new classes introduced because of the pattern overcomplicate the program.


#### Visitor Pattern

According to Wikipedia, "The visitor design pattern is a way of separating an algorithm from an object structure on which it operates.
In essence, the visitor allows adding new virtual functions to a family of classes, without modifying the classes. Instead, a visitor class is created that implements all of the appropriate specializations of the virtual function". Therefore, the **Visitor Pattern** allows us to extend a classe's functionality by creating functions outside of said class.
So, for the different shapes of the program (rectangle, circle, triangle, polygon), a visitor sub-class was implemented, which implements the needed functionality (translate the shape's attributes into data).

When it comes to implementation, at first, a simple class was created, *Visitor*, which can be seen bellow. 

```typescript
export interface Visitor {
  visitRectangle(rect: Rectangle): Element;
  visitCircle(circle: Circle): Element;
  visitPolygon(polyg: Polygon): Element;
  visitTriangle(triangle: Triangle): Element;
}
```

Also, in each of the necessary classes (*Rectangle*, *Triangle*, *Circle*, *Polygon*, *Shape*), an aditional *accept()* method was created to handle the additional functionality.

```typescript
accept(visitor: Visitor): Element {
    return visitor.visitRectangle(this);
  }
```

The Visitor class' methods are then implemented by the subclass *XMLExporterVisitor* (https://github.com/jmrocha/asso19_project/blob/feature/ImportAndExport/src/persistence/exporter.ts#L380).
This way, in order to translate a shape's attributes into data, it is only necessary to execute it's *accept()* method, as seen in the below code:

```typescript
const visitor = new XMLExporterVisitor(xmlDoc);

    for (const shape of objects) {
      storedShapes.appendChild(shape.accept(visitor));
    }
```

When it comes to consequences, the **Visitor Pattern** brings very valuable advantages: it allowed us to traverse a complex object container (an array of objects of different types) and apply a especific functionality to each of those objects, and it also allows for extensibility purposes, as it is possible to introduce new behaviours/functionalities to classes without having to directly change those classes. As for disadvantages, visitors lack the access to private class fields and methods, which can be bad if you need those fields or methods for a certain functionality; fortunately, this wasn't a problem for us.
