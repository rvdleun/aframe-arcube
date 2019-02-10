# ARCube

![ARCube template](https://raw.githubusercontent.com/rvdleun/aframe-arcube/master/ARCube-template.png?token=ADO5IT01LxcfbTdy8r-72UddbsEAW1Wxks5cXcAuwA%3D%3D)

This repository will help you get setup with the ARCube, an open-source project to hold objects in the palm of your hand, using Augmented Reality.

## Instructions
Note: This section presume that the user has experience with AFrame. If this is not the case, then please follow the tutorials at [AFrame school](https://aframe.io/aframe-school/).

### Basic example
```html
<!doctype HTML>
<html>
  <head>
    <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
    <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.2/aframe/build/aframe-ar.js"> </script>
    <script src="https://rvdleun.github.io/aframe-arcube/dist/aframe-arcube.min.js"></script>
    <script>
      THREEx.ArToolkitContext.baseURL = 'https://rawgit.com/jeromeetienne/ar.js/master/three.js/'
    </script>
  </head>
  <body>
    <a-scene embedded arjs='debugUIEnabled: false; sourceType: webcam; detectionMode: mono;' vr-mode-ui="enabled: false">
        <a-arcube>
            <a-box color="red"></a-box>
        </a-arcube>
        <a-entity camera></a-entity>
    </a-scene>
  </body>
</html>
```
This example will get you up and running. Anything placed between `<a-arcube></a-arcube>` will be rendered on the same position as the cube.

Note: When using this example, the markers may not download due to an ad blocker. You may need to turn it off. Host the files locally to avoid this issue.

### Local installation

Download `aframe-arcube.zip` in the `dist` directory and unzip it in your project directory. Add `aframe-arcube.min.js` to your HTML file. Do not forget to include AR.JS either.

Make sure that the markers directory is in the same location as the javascript file.

### Component

The `arcube` component will position the entity on the same position as the ARCube.

#### Properties

| Property         | Description                                                                                                    | Default value |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| enabled          | Whether the component is active. If not, the object will not be visible                                        | true          |
| scale            | Sets the scale of the the entity. The default setting will ensure that 1-unit object will fully cover the cube | 1.45          |
| timeout          | How long the entity will remain visible when all markers are lost in milliseconds                              | 500           |

#### Example
```html
<a-entity ar-cube="scale: 2; timeout: 2000">
  <a-sphere src="#earth"></a-sphere>
</a-arcube>
```

### Primitive
The `a-arcube` primitive is available for an easier way to implement arcube. All attributes are automatically mapped to their respective properties.

#### Example
```html
<a-arcube enabled="false" scale="1.5" timeout="0">
  <a-obj-model src="#star-destroyer-obj" mtl="#star-destroyer-mtl"></a-obj-model>
</a-arcube>
```

## Development
This section will cover all things related to development for the ARCube component

## How it works
* When first starting the scene, the `arcube` system will create a new entity in the scene and add six `a-markers` to it as children, one for each side of the cube.
* Each `a-marker` has an entity as its child, positioned and rotated specifically, based its the side of the cube. This entity is called an anchor.
* When a marker is detected for the first time, it will be tagged as the active marker.
* If a second marker is detected while there is an active one, it will be added into an array. Should the active marker is lost, then the next marker in the array will become the active one.
* The `arcube` component will wait until there is an active marker. If so, it will set itself to visible and place the object on the same position and rotation as the marker's anchor.
* If detection of all markers are lost, the `arcube` component will keep the object in view until a certain timeout(half a second by default) and will then set the visibility to false.

### Develop locally
* Run `npm run dev`
* Open a web browser
* Go to `localhost:7000` on your desktop
* Note that you can have a virtual cube to test with at `localhost:7000/cube.html`

### Build
* Run `npm run build`
* A ready-for-deployment component will be available in the dist directory.

### Roadmap
* Events
* Setup local SSL proxy for testing on mobile
* Fix adblocker issue
* Animate movement to avoid jittery look
* Allow custom markers for custom cubes
* Support for multiple arcubes.

## Thanks to...
* [AFrame](aframe.io) for making WebXR projects fun
* [Jerome Etienne](https://twitter.com/jerome_etienne) for his phenomenal work on [AR.JS](https://github.com/jeromeetienne/AR.js)
* [Detlef La Grand](https://www.linkedin.com/in/detleflagrand/) from [VRmaster.co](https://vrmaster.co) for getting the ball(or cube) rolling
* [Daniel van der Stam](https://www.linkedin.com/in/daniel-van-der-stam-7616a34) from [webxr.nl](https://webxr.nl) for helping out with the initial brainstorming