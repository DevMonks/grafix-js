Grafix.js
=========

Probably a HTML5 Canvas Manipulation Toolkit...or something in that direction.


So what about it?
=================

Grafix is an abstraction of/for the HTML5 canvas element with the goal to bring it to life in a most simple and easy way.
This library doesn't nessecarily aim for being a game engine, but rather wants to provide a solid way for animating, enhancing and positioning shapes and images inside canvas, which can be used for anything _and_ games.

The syntax and library features are designed to be used as easy as possible to get your application up as fast as possible, without sacrificing performance, useful features and tools.


How far is it?
==============

Well, take a look at it. We just started. There's a ton of stuff already done, but there's still another ton ahead.
Some parts could already be used for serious programming, but honestly, don't use it in your projects yet.

It's online here to be able to contribute to it, get some feedback and input from you and also just to show you, what we've been working on lately.


What can it do?
===============

Many things, really. Let's list a few:

- Positioning: Automatic alignment of shapes inside the canvas, similar to jQuery.position, but easier to use

  e.g. `rect.alignContext = 'parent'; rect.align = 'top left inner'; rect.align = 'bottom right outer';` (Of course you can also apply those via JSON)
- Animating. Create animations easily and add new animation easings easily with the definition of 2 points (bezier curve)

  e.g. `Easing.create( .17, .67, .83, .67 );` (You can use http://cubic-bezier.com/ to get the values)
- Provides a DOM-style shape hierarchy inside canvas

  Child shapes and child-child shapes provide an easy way to do positioning and animating when it comes to having a ton of elements on your scene
- Performance. Grafix is laid out to be as fast as possible, that's why we don't abstract the language itself and don't try to create new initialization constructs.
  
  Grafix is based on strict, valid ECMAScript and doesn't use hacky stuff to achieve its goals. This will make Grafix work easily across all browsers and hardware.
- Mobility/Portability. Since HTML5, CSS and JavaScript work on all possible kind of devices, Grafix works on all possible kind of devices.
  
  A game or application written once can be used anywhere, your desktop-PC, your phone, your tablet, your fridge, your toaster, it doesn't matter.
- Texts! Canvas has bad support for simple Texts, it can't even break them when you have line breaks in it.
  
  With Grafix it's as easy as saying `Text.create( 'My text\nwith breaks', '15 blue helvetica' )` and you can use the resulting shape like all other shapes (aligning, positioning etc. possible)
- Tilesets. Feed grafix with a tileset and it can easily transform and align the single tiles accordingly.

  Tilesets can also be used for creating animations based on images. Grafix also does that automatically on demand.
- Color and pixel manipulation.
 
  This will include defining filters for images, shapes and tilesets that get applied before they're drawn to the stage
- Memory saving. Grafix really only draws, what needs to be drawn.

  This is achieved through simple features of JavaScript that track the state of our shapes. Collision detection is sometimes less costy than re-drawing.
- Maths. We all know, you hated it in school (some even liked it, hey!), but Grafix does the math for you.

  No calculating radians to decimals, no calculating point distances to each other, no calculating head-aching curves or anything, we provide an easy way to do all that for you.
  
  
How can I contribute?
=====================

If you have ideas or even code to provide, just contact us via GitHub or write a mail to

grafix@devmonks.net

We'll answer your requests as soon as possible and will look, where we'll get to
