var kurst;
(function (kurst) {
    // https://github.com/mrdoob/eventdispatcher.js/
    /*
    * Author: mr.doob / https://github.com/mrdoob/eventdispatcher.js/
    * TypeScript Conversion : Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (_event) {
        var credits = (function () {
            function credits() {
                this.str = 'mr.doob / https://github.com/mrdoob/eventdispatcher.js/';
            }
            return credits;
        })();

        var EventDispatcher = (function () {
            function EventDispatcher() {
                //--------------------------------------------------------------------------
                this.listeners = new Array();
            }
            //--------------------------------------------------------------------------
            /*
            */
            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if (this.listeners[type] === undefined) {
                    this.listeners[type] = new Array();
                }

                if (this.listeners[type].indexOf(listener) === -1) {
                    this.listeners[type].push(listener);
                }
            };

            /*
            */
            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.listeners[type].indexOf(listener);

                if (index !== -1) {
                    this.listeners[type].splice(index, 1);
                }
            };

            /*
            */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];

                if (listenerArray !== undefined) {
                    this.lFncLength = listenerArray.length;
                    event.target = this;

                    for (var i = 0, l = this.lFncLength; i < l; i++) {
                        listenerArray[i].call(this, event);
                    }
                }
            };
            return EventDispatcher;
        })();
        _event.EventDispatcher = EventDispatcher;

        //--------------------------------------------------------------------------
        var Event = (function () {
            function Event(type) {
                this.type = type;
            }
            return Event;
        })();
        _event.Event = Event;
    })(kurst.event || (kurst.event = {}));
    var event = kurst.event;
})(kurst || (kurst = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /// <reference path="../../libs/maps/three.d.ts" />
    /**
    * @author qiao / https://github.com/qiao
    * @author mrdoob / http://mrdoob.com
    * @author alteredq / http://alteredqualia.com/
    * @author WestLangley / http://github.com/WestLangley
    * @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
    */
    (function (threejs) {
        var credits = (function () {
            function credits() {
            }
            return credits;
        })();

        var OrbitControlsState = (function () {
            function OrbitControlsState() {
                this.NONE = -1;
                this.ROTATE = 0;
                this.ZOOM = 1;
                this.PAN = 2;
                this.TOUCH_ROTATE = 3;
                this.TOUCH_ZOOM = 4;
                this.TOUCH_PAN = 5;
            }
            return OrbitControlsState;
        })();
        threejs.OrbitControlsState = OrbitControlsState;

        var OrbitControlsKeys = (function () {
            function OrbitControlsKeys() {
                this.LEFT = 37;
                this.UP = 38;
                this.RIGHT = 39;
                this.BOTTOM = 40;
            }
            return OrbitControlsKeys;
        })();
        threejs.OrbitControlsKeys = OrbitControlsKeys;

        var OrbitControls = (function (_super) {
            __extends(OrbitControls, _super);
            //------------------------------------------------------------------------------
            function OrbitControls(object, domElement) {
                var _this = this;
                _super.call(this);
                //--VARS PUBLIC----------------------------------------------------------------------
                this.center = new THREE.Vector3();
                this.userZoom = true;
                this.userZoomSpeed = 1.0;
                this.userRotate = true;
                this.userRotateSpeed = 1.0;
                this.userPan = true;
                this.userPanSpeed = 2.0;
                this.autoRotate = false;
                this.autoRotateSpeed = 2.0;
                this.minPolarAngle = 0;
                this.maxPolarAngle = Math.PI;
                this.minDistance = 0;
                this.maxDistance = Infinity;
                //--VARS PRIVATE----------------------------------------------------------------------
                this.keys = new OrbitControlsKeys();
                this.EPS = 0.000001;
                this.PIXELS_PER_ROUND = 1800;
                this.rotateStart = new THREE.Vector2();
                this.rotateEnd = new THREE.Vector2();
                this.rotateDelta = new THREE.Vector2();
                this.zoomStart = new THREE.Vector2();
                this.zoomEnd = new THREE.Vector2();
                this.zoomDelta = new THREE.Vector2();
                this.phiDelta = 0;
                this.thetaDelta = 0;
                this.scale = 1;
                this.lastPosition = new THREE.Vector3();
                this.STATE = new OrbitControlsState();
                //--VARS EVENTS----------------------------------------------------------------------
                this.changeEvent = new kurst.event.Event('change');

                this.domElement = (domElement !== undefined) ? domElement : document;

                this.state = this.STATE.NONE;
                this.object = object;

                this.onMouseMoveFnc = function (event) {
                    _this.onMouseMove(event);
                };
                this.onMouseUpFnc = function (event) {
                    _this.onMouseUp(event);
                };

                this.onMouseDownFnc = function (event) {
                    _this.onMouseDown(event);
                };
                this.onMouseWheelFnc = function (event) {
                    _this.onMouseWheel(event);
                };
                this.onKeyDownFnc = function (event) {
                    _this.onKeyDown(event);
                };

                this.domElement.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                }, false);
                this.domElement.addEventListener('mousedown', this.onMouseDownFnc, false);
                this.domElement.addEventListener('mousewheel', this.onMouseWheelFnc, false);
                this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheelFnc, false); // firefox
                this.domElement.addEventListener('keydown', this.onKeyDownFnc, false);
            }
            //------------------------------------------------------------------------------
            /*
            */
            OrbitControls.prototype.rotateLeft = function (angle) {
                if (angle === undefined) {
                    angle = this.getAutoRotationAngle();
                }

                this.thetaDelta -= angle;
            };

            /*
            */
            OrbitControls.prototype.rotateRight = function (angle) {
                if (angle === undefined) {
                    angle = this.getAutoRotationAngle();
                }

                this.thetaDelta += angle;
            };

            /*
            */
            OrbitControls.prototype.rotateUp = function (angle) {
                if (angle === undefined) {
                    angle = this.getAutoRotationAngle();
                }

                this.phiDelta -= angle;
            };

            /*
            */
            OrbitControls.prototype.rotateDown = function (angle) {
                if (angle === undefined) {
                    angle = this.getAutoRotationAngle();
                }

                this.phiDelta += angle;
            };

            /*
            */
            OrbitControls.prototype.zoomIn = function (zoomScale) {
                if (zoomScale === undefined) {
                    zoomScale = this.getZoomScale();
                }

                this.scale /= zoomScale;
            };

            /*
            */
            OrbitControls.prototype.zoomOut = function (zoomScale) {
                if (zoomScale === undefined) {
                    zoomScale = this.getZoomScale();
                }

                this.scale *= zoomScale;
            };

            /*
            */
            OrbitControls.prototype.pan = function (distance) {
                distance.transformDirection(this.object.matrix);
                distance.multiplyScalar(this.userPanSpeed);

                this.object.position.add(distance);
                this.center.add(distance);
            };

            /*
            */
            OrbitControls.prototype.update = function () {
                var position = this.object.position;
                var offset = position.clone().sub(this.center);

                // angle from z-axis around y-axis
                var theta = Math.atan2(offset.x, offset.z);

                // angle from y-axis
                var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

                if (this.autoRotate) {
                    this.rotateLeft(this.getAutoRotationAngle());
                }

                theta += this.thetaDelta;
                phi += this.phiDelta;

                // restrict phi to be between desired limits
                phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));

                // restrict phi to be betwee EPS and PI-EPS
                phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, phi));

                var radius = offset.length() * this.scale;

                // restrict radius to be between desired limits
                radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));

                offset.x = radius * Math.sin(phi) * Math.sin(theta);
                offset.y = radius * Math.cos(phi);
                offset.z = radius * Math.sin(phi) * Math.cos(theta);

                position.copy(this.center).add(offset);

                this.object.lookAt(this.center);

                this.thetaDelta = 0;
                this.phiDelta = 0;
                this.scale = 1;

                if (this.lastPosition.distanceTo(this.object.position) > 0) {
                    this.dispatchEvent(this.changeEvent);

                    this.lastPosition.copy(this.object.position);
                }
            };

            //--PRIVATE----------------------------------------------------------------------
            /*
            */
            OrbitControls.prototype.getAutoRotationAngle = function () {
                return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
            };

            /*
            */
            OrbitControls.prototype.getZoomScale = function () {
                return Math.pow(0.95, this.userZoomSpeed);
            };

            //--EVENTS----------------------------------------------------------------------
            /*
            */
            OrbitControls.prototype.onMouseDown = function (event) {
                if (!this.userRotate)
                    return;

                event.preventDefault();

                if (event.button === 0) {
                    this.state = this.STATE.ROTATE;

                    this.rotateStart.set(event.clientX, event.clientY);
                } else if (event.button === 1) {
                    this.state = this.STATE.ZOOM;

                    this.zoomStart.set(event.clientX, event.clientY);
                } else if (event.button === 2) {
                    this.state = this.STATE.PAN;
                }

                document.addEventListener('mousemove', this.onMouseMoveFnc, false);
                document.addEventListener('mouseup', this.onMouseUpFnc, false);
            };

            /*
            */
            OrbitControls.prototype.onMouseMove = function (event) {
                event.preventDefault();

                if (this.state === this.STATE.ROTATE) {
                    this.rotateEnd.set(event.clientX, event.clientY);
                    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);

                    this.rotateLeft(2 * Math.PI * this.rotateDelta.x / this.PIXELS_PER_ROUND * this.userRotateSpeed);
                    this.rotateUp(2 * Math.PI * this.rotateDelta.y / this.PIXELS_PER_ROUND * this.userRotateSpeed);

                    this.rotateStart.copy(this.rotateEnd);
                } else if (this.state === this.STATE.ZOOM) {
                    this.zoomEnd.set(event.clientX, event.clientY);
                    this.zoomDelta.subVectors(this.zoomEnd, this.zoomStart);

                    if (this.zoomDelta.y > 0) {
                        this.zoomIn();
                    } else {
                        this.zoomOut();
                    }

                    this.zoomStart.copy(this.zoomEnd);
                } else if (this.state === this.STATE.PAN) {
                    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                    this.pan(new THREE.Vector3(-movementX, movementY, 0));
                }
            };

            /*
            */
            OrbitControls.prototype.onMouseUp = function (event) {
                if (!this.userRotate)
                    return;

                document.removeEventListener('mousemove', this.onMouseMoveFnc, false);
                document.removeEventListener('mouseup', this.onMouseUpFnc, false);

                this.state = this.STATE.NONE;
            };

            /*
            */
            OrbitControls.prototype.onMouseWheel = function (event) {
                if (!this.userZoom)
                    return;

                var delta = 0;

                if (event.wheelDelta) {
                    delta = event.wheelDelta;
                } else if (event.detail) {
                    delta = -event.detail;
                }

                if (delta > 0) {
                    this.zoomOut();
                } else {
                    this.zoomIn();
                }
            };

            /*
            */
            OrbitControls.prototype.onKeyDown = function (event) {
                if (!this.userPan)
                    return;

                switch (event.keyCode) {
                    case this.keys.UP:
                        this.pan(new THREE.Vector3(0, 1, 0));
                        break;
                    case this.keys.BOTTOM:
                        this.pan(new THREE.Vector3(0, -1, 0));
                        break;
                    case this.keys.LEFT:
                        this.pan(new THREE.Vector3(-1, 0, 0));
                        break;
                    case this.keys.RIGHT:
                        this.pan(new THREE.Vector3(1, 0, 0));
                        break;
                }
            };
            return OrbitControls;
        })(kurst.event.EventDispatcher);
        threejs.OrbitControls = OrbitControls;
    })(kurst.threejs || (kurst.threejs = {}));
    var threejs = kurst.threejs;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (data) {
        var JSonLoader = (function (_super) {
            __extends(JSonLoader, _super);
            //--------------------------------------------------------------------------
            function JSonLoader() {
                _super.call(this);
                //--------------------------------------------------------------------------
                this.LOAD_SUCCESS = new kurst.event.Event('JSonLoader_loaded');
                this.LOAD_ERROR = new kurst.event.Event('JSonLoader_loaderror');

                this.loader = new XMLHttpRequest();
            }
            //--------------------------------------------------------------------------
            /*
            * Load a JSON data file
            */
            JSonLoader.prototype.loadJson = function (uri) {
                if (!this.loader) {
                    this.loader = new XMLHttpRequest();
                }

                var controller = this;

                this.loader.open('GET', uri, true);
                this.loader.onload = function (event) {
                    controller.onLoadComplete(event);
                };
                this.loader.onerror = function (event) {
                    controller.onLoadError(event);
                };
                this.loader.responseType = 'text';

                this.loader.send();
            };

            /*
            * Get JSON data
            */
            JSonLoader.prototype.getData = function () {
                return this.jsonData;
            };

            /*
            * Get RAW JSON string
            */
            JSonLoader.prototype.getJSONString = function () {
                return this.jsonString;
            };

            /*
            * Set Callback
            
            public setLoadCallback( target : Object , loadedCallback : Function , loadErrorCallback ? : Function ) : void {
            
            this.target                 = target;
            this.loadedCallback         = loadedCallback;
            this.loadErrorCallback      = loadErrorCallback;
            
            }
            */
            //--------------------------------------------------------------------------
            /*
            * Data load completed
            */
            JSonLoader.prototype.onLoadComplete = function (event) {
                var xhr = event['currentTarget'];

                try  {
                    this.jsonData = JSON.parse(xhr.responseText);
                    this.jsonString = xhr.responseText;

                    this.dispatchEvent(this.LOAD_SUCCESS);
                    /*
                    if ( this.loadedCallback ){
                    
                    this.loadedCallback.apply( this.target );
                    
                    }
                    */
                } catch (e) {
                    this.jsonString = xhr.responseText;

                    this.dispatchEvent(this.LOAD_ERROR);
                    /*
                    if ( this.loadErrorCallback ){
                    
                    this.loadErrorCallback.apply( this.target );
                    
                    }
                    */
                }
            };

            /*
            * Data load error
            */
            JSonLoader.prototype.onLoadError = function (event) {
                var xhr = event['currentTarget'];
                xhr.abort();

                this.dispatchEvent(this.LOAD_ERROR);
                /*
                if ( this.loadErrorCallback ){
                
                this.loadErrorCallback.apply( this.target );
                
                }
                */
            };
            return JSonLoader;
        })(kurst.event.EventDispatcher);
        data.JSonLoader = JSonLoader;
    })(kurst.data || (kurst.data = {}));
    var data = kurst.data;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /// <reference path="JSonLoader.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (data) {
        //------------------------------------------------------------------------------------------
        var GeoData = (function () {
            function GeoData() {
            }
            return GeoData;
        })();
        data.GeoData = GeoData;
    })(kurst.data || (kurst.data = {}));
    var data = kurst.data;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    // <reference path="../../libs/maps/webgl.d.ts" />
    /**
    * @author alteredq / http://alteredqualia.com/
    * @author mr.doob / http://mrdoob.com/
    * @author kB / http://kurst.co.uk/
    */
    /**
    * Notes:
    **
    *      var canvas  : HTMLCanvasElement         = <HTMLCanvasElement>document.createElement("canvas");
    *      var context : any                       = this.createCanvas().getContext("experimental-webgl");
    *      var gl      : WebGLRenderingContext      = <WebGLRenderingContext> context;
    *      canvas.getContext('webgl');
    */
    (function (threejs) {
        var credits = (function () {
            function credits() {
                this.authorA = 'alteredq / http://alteredqualia.com/';
                this.authorB = 'mr.doob / http://mrdoob.com/';
                this.authorC = 'Karim Beyrouti / http://kurst.co.uk ( typescript conversion )';
            }
            return credits;
        })();

        var Detector = (function () {
            //--------------------------------------------------------------------------
            function Detector() {
                this.canvas = !!this.createCanvas();
                this.webgl = this.testWebGlRenderingContext();
                this.workers = !!window['Worker'];
                this.fileAPI = !!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob']);
            }
            //--------------------------------------------------------------------------
            /*
            */
            Detector.prototype.addGetWebGLMessage = function (parameters) {
                var parent, id, element;

                parameters = parameters || {};

                parent = parameters.parent !== undefined ? parameters.parent : document.body;
                id = parameters.id !== undefined ? parameters.id : 'oldie';

                element = this.getWebGLErrorMessage();
                element.id = id;

                parent.appendChild(element);
            };

            /*
            */
            Detector.prototype.getWebGLErrorMessage = function () {
                var element = document.createElement('div');
                element.id = 'webgl-error-message2';
                element.style.fontFamily = 'monospace';
                element.style.fontSize = '13px';
                element.style.fontWeight = 'normal';
                element.style.textAlign = 'center';
                element.style.background = '#fff';
                element.style.color = '#000';
                element.style.padding = '1.5em';
                element.style.width = '400px';
                element.style.margin = '5em auto 0';

                element.innerHTML = window['WebGLRenderingContext'] ? [
                    'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                    'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                ].join('\n') : [
                    'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                    'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                ].join('\n');

                return element;
            };

            /*
            */
            Detector.prototype.testWebGlRenderingContext = function () {
                try  {
                    var experimental = !!this.createCanvas().getContext("experimental-webgl");

                    var webGL = !!this.createCanvas().getContext("webgl");

                    return experimental || webGL;
                } catch (e) {
                    return false;
                }
            };

            /*
            */
            Detector.prototype.createCanvas = function () {
                return document.createElement("canvas");
            };
            return Detector;
        })();
        threejs.Detector = Detector;
    })(kurst.threejs || (kurst.threejs = {}));
    var threejs = kurst.threejs;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /// <reference path="../../libs/maps/three.d.ts" />
    /*!
    * @author Eberhard Graether / http://egraether.com/
    * @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
    */
    (function (threejs) {
        //--TrackballControlsScreen----------------------------------------------------------------------
        var credits = (function () {
            function credits() {
                this.authorA = 'Eberhard Graether / http://egraether.com/';
                this.authorB = 'Karim Beyrouti / http://kurst.co.uk ( typescript conversion )';
            }
            return credits;
        })();

        var TrackballControlsScreen = (function () {
            function TrackballControlsScreen() {
                this.width = 0;
                this.height = 0;
                this.offsetLeft = 0;
                this.offsetTop = 0;
            }
            return TrackballControlsScreen;
        })();
        threejs.TrackballControlsScreen = TrackballControlsScreen;

        //--TrackballControlsState----------------------------------------------------------------------
        var TrackballControlsState = (function () {
            function TrackballControlsState() {
                this.NONE = -1;
                this.ROTATE = 0;
                this.ZOOM = 1;
                this.PAN = 2;
                this.TOUCH_ROTATE = 3;
                this.TOUCH_ZOOM = 4;
                this.TOUCH_PAN = 5;
            }
            return TrackballControlsState;
        })();
        threejs.TrackballControlsState = TrackballControlsState;

        //--TrackballControlsState----------------------------------------------------------------------
        var TrackballControls = (function (_super) {
            __extends(TrackballControls, _super);
            //------------------------------------------------------------------------
            function TrackballControls(object, domElement) {
                var _this = this;
                _super.call(this);
                //--PUBLIC----------------------------------------------------------------------
                this.enabled = true;
                this.rotateSpeed = 1.0;
                this.zoomSpeed = 1.2;
                this.panSpeed = 0.3;
                this.wheelSpeed = 0.15;
                this.noRotate = false;
                this.noZoom = false;
                this.noPan = false;
                this.staticMoving = false;
                this.dynamicDampingFactor = 0.2;
                this.minDistance = 0;
                this.maxDistance = Infinity;
                //--PRIVATE----------------------------------------------------------------------
                this.STATE = new kurst.threejs.TrackballControlsState();
                this.screen = new kurst.threejs.TrackballControlsScreen();
                this._touchZoomDistanceStart = 0;
                this._touchZoomDistanceEnd = 0;
                this.changeEvent = new kurst.event.Event('change');

                // Variables
                this.object = object;
                this.domElement = (domElement !== undefined) ? domElement : document;
                this.radius = (this.screen.width + this.screen.height) / 4;
                this.target = new THREE.Vector3();
                this.lastPosition = new THREE.Vector3();
                this._state = this.STATE.NONE;
                this._prevState = this.STATE.NONE;
                this._eye = new THREE.Vector3(), this._rotateStart = new THREE.Vector3(), this._rotateEnd = new THREE.Vector3(), this._zoomStart = new THREE.Vector2(), this._zoomEnd = new THREE.Vector2(), this._panStart = new THREE.Vector2();
                this._panEnd = new THREE.Vector2();
                this.target0 = this.target.clone();
                this.position0 = this.object.position.clone();
                this.up0 = this.object.up.clone();
                this.keys = new Array(65, 83, 68);

                // Event Proxies
                this.mousewheelFnc = function (event) {
                    _this.mousewheel(event);
                };
                this.mousedownFnc = function (event) {
                    _this.mousedown(event);
                };
                this.mouseupFnc = function (event) {
                    _this.mouseup(event);
                };
                this.mousemoveFnc = function (event) {
                    _this.mousemove(event);
                };
                this.DOMMouseScrollFnc = function (event) {
                    _this.DOMMouseScrollFnc(event);
                };
                this.touchstartFnc = function (event) {
                    _this.touchstart(event);
                };
                this.touchendFnc = function (event) {
                    _this.touchend(event);
                };
                this.touchmoveFnc = function (event) {
                    _this.touchmove(event);
                };
                this.keydownFnc = function (event) {
                    _this.keydown(event);
                };
                this.keyupFnc = function (event) {
                    _this.keyup(event);
                };

                // Add Event Listeners
                this.domElement.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                }, false);
                this.domElement.addEventListener('mousedown', this.mousedownFnc, false);
                this.domElement.addEventListener('mousewheel', this.mousewheelFnc, false);
                this.domElement.addEventListener('DOMMouseScroll', this.DOMMouseScrollFnc, false); // firefox
                this.domElement.addEventListener('touchstart', this.touchstartFnc, false);
                this.domElement.addEventListener('touchend', this.touchendFnc, false);
                this.domElement.addEventListener('touchmove', this.touchmoveFnc, false);

                window.addEventListener('keydown', function (event) {
                    return _this.keydown(event);
                }, false);
                window.addEventListener('keyup', function (event) {
                    return _this.keyup(event);
                }, false);

                this.handleResize();
            }
            //--PUBLIC----------------------------------------------------------------------
            /*
            */
            TrackballControls.prototype.update = function () {
                this._eye.subVectors(this.object.position, this.target);

                if (!this.noRotate) {
                    this.rotateCamera();
                }

                if (!this.noZoom) {
                    this.zoomCamera();
                }

                if (!this.noPan) {
                    this.panCamera();
                }

                this.object.position.addVectors(this.target, this._eye);

                this.checkDistances();

                this.object.lookAt(this.target);

                if (this.lastPosition.distanceToSquared(this.object.position) > 0) {
                    this.dispatchEvent(this.changeEvent);

                    this.lastPosition.copy(this.object.position);
                }
            };

            /*
            */
            TrackballControls.prototype.reset = function () {
                this._state = this.STATE.NONE;
                this._prevState = this.STATE.NONE;
                this.target.copy(this.target0);
                this.object.position.copy(this.position0);
                this.object.up.copy(this.up0);
                this._eye.subVectors(this.object.position, this.target);
                this.object.lookAt(this.target);
                this.dispatchEvent(this.changeEvent);
                this.lastPosition.copy(this.object.position);
            };

            //--PRIVATE----------------------------------------------------------------------
            /*
            */
            TrackballControls.prototype.handleEvent = function (event) {
                if (typeof this[event.type] == 'function') {
                    this[event.type](event);
                }
            };

            /*
            */
            TrackballControls.prototype.getMouseOnScreen = function (clientX, clientY) {
                return new THREE.Vector2((clientX - this.screen.offsetLeft) / this.radius * 0.5, (clientY - this.screen.offsetTop) / this.radius * 0.5);
            };

            /*
            */
            TrackballControls.prototype.getMouseProjectionOnBall = function (clientX, clientY) {
                var mouseOnBall = new THREE.Vector3((clientX - this.screen.width * 0.5 - this.screen.offsetLeft) / this.radius, (this.screen.height * 0.5 + this.screen.offsetTop - clientY) / this.radius, 0.0);

                var length = mouseOnBall.length();

                if (length > 1.0) {
                    mouseOnBall.normalize();
                } else {
                    mouseOnBall.z = Math.sqrt(1.0 - length * length);
                }

                this._eye.copy(this.object.position).sub(this.target);

                var projection = this.object.up.clone().setLength(mouseOnBall.y);
                projection.add(this.object.up.clone().cross(this._eye).setLength(mouseOnBall.x));
                projection.add(this._eye.setLength(mouseOnBall.z));
                return projection;
            };

            /*
            */
            TrackballControls.prototype.rotateCamera = function () {
                var angle = Math.acos(this._rotateStart.dot(this._rotateEnd) / this._rotateStart.length() / this._rotateEnd.length());

                if (angle) {
                    var axis = (new THREE.Vector3()).crossVectors(this._rotateStart, this._rotateEnd).normalize();
                    var quaternion = new THREE.Quaternion();

                    angle *= this.rotateSpeed;

                    quaternion.setFromAxisAngle(axis, -angle);

                    this._eye.applyQuaternion(quaternion);
                    this.object.up.applyQuaternion(quaternion);

                    this._rotateEnd.applyQuaternion(quaternion);

                    if (this.staticMoving) {
                        this._rotateStart.copy(this._rotateEnd);
                    } else {
                        quaternion.setFromAxisAngle(axis, angle * (this.dynamicDampingFactor - 1.0));
                        this._rotateStart.applyQuaternion(quaternion);
                    }
                }
            };

            /*
            */
            TrackballControls.prototype.zoomCamera = function () {
                if (this._state === this.STATE.TOUCH_ZOOM) {
                    var factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
                    this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
                    this._eye.multiplyScalar(factor);
                } else {
                    var factor = 1.0 + (this._zoomEnd.y - this._zoomStart.y) * this.zoomSpeed;

                    if (factor !== 1.0 && factor > 0.0) {
                        this._eye.multiplyScalar(factor);

                        if (this.staticMoving) {
                            this._zoomStart.copy(this._zoomEnd);
                        } else {
                            this._zoomStart.y += (this._zoomEnd.y - this._zoomStart.y) * this.dynamicDampingFactor;
                        }
                    }
                }
            };

            /*
            */
            TrackballControls.prototype.panCamera = function () {
                var mouseChange = this._panEnd.clone().sub(this._panStart);

                if (mouseChange.lengthSq()) {
                    mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);

                    var pan = this._eye.clone().cross(this.object.up).setLength(mouseChange.x);
                    pan.add(this.object.up.clone().setLength(mouseChange.y));

                    this.object.position.add(pan);
                    this.target.add(pan);

                    if (this.staticMoving) {
                        this._panStart = this._panEnd;
                    } else {
                        this._panStart.add(mouseChange.subVectors(this._panEnd, this._panStart).multiplyScalar(this.dynamicDampingFactor));
                    }
                }
            };

            /*
            */
            TrackballControls.prototype.checkDistances = function () {
                if (!this.noZoom || !this.noPan) {
                    if (this.object.position.lengthSq() > this.maxDistance * this.maxDistance) {
                        this.object.position.setLength(this.maxDistance);
                    }

                    if (this._eye.lengthSq() < this.minDistance * this.minDistance) {
                        this.object.position.addVectors(this.target, this._eye.setLength(this.minDistance));
                    }
                }
            };

            //--EVENT LISTENERS----------------------------------------------------------------------
            /*
            */
            TrackballControls.prototype.handleResize = function () {
                this.screen.width = window.innerWidth;
                this.screen.height = window.innerHeight;
                this.screen.offsetLeft = 0;
                this.screen.offsetTop = 0;

                this.radius = (this.screen.width + this.screen.height) / 4;
            };

            /*
            */
            TrackballControls.prototype.keydown = function (event) {
                if (this.enabled === false)
                    return;

                console.log('keyDown');

                //window.removeEventListener( 'keydown',event => this.keydown( event ) );
                //window.addEventListener( 'keydown', event => this.keydown( event ) , false );
                //window.addEventListener( 'keyup', event => this.keyup( event )  , false );
                this._prevState = this._state;

                if (this._state !== this.STATE.NONE) {
                    return;
                } else if (event.keyCode === this.keys[this.STATE.ROTATE] && !this.noRotate) {
                    this._state = this.STATE.ROTATE;
                } else if (event.keyCode === this.keys[this.STATE.ZOOM] && !this.noZoom) {
                    this._state = this.STATE.ZOOM;
                } else if (event.keyCode === this.keys[this.STATE.PAN] && !this.noPan) {
                    this._state = this.STATE.PAN;
                }
            };

            /*
            */
            TrackballControls.prototype.keyup = function (event) {
                if (this.enabled === false)
                    return;

                this._state = this._prevState;
                //window.addEventListener( 'keydown', this.keydown, false );
                //window.addEventListener( 'keydown', event => this.keydown( event ) , false );
                //window.addEventListener( 'keyup', event => this.keyup( event )  , false );
            };

            /*
            */
            TrackballControls.prototype.mousedown = function (event) {
                if (this.enabled === false)
                    return;

                event.preventDefault();
                event.stopPropagation();

                if (this._state === this.STATE.NONE) {
                    this._state = event.button;
                }

                if (this._state === this.STATE.ROTATE && !this.noRotate) {
                    this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
                } else if (this._state === this.STATE.ZOOM && !this.noZoom) {
                    this._zoomStart = this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                } else if (this._state === this.STATE.PAN && !this.noPan) {
                    this._panStart = this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                }

                this.domElement.addEventListener('mousemove', this.mousemoveFnc, false);
                this.domElement.addEventListener('mouseup', this.mouseupFnc, false);
            };

            /*
            */
            TrackballControls.prototype.mousemove = function (event) {
                if (this.enabled === false)
                    return;

                event.preventDefault();
                event.stopPropagation();

                if (this._state === this.STATE.ROTATE && !this.noRotate) {
                    this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
                } else if (this._state === this.STATE.ZOOM && !this.noZoom) {
                    this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                } else if (this._state === this.STATE.PAN && !this.noPan) {
                    this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                }
            };

            /*
            */
            TrackballControls.prototype.mouseup = function (event) {
                if (this.enabled === false)
                    return;

                event.preventDefault();
                event.stopPropagation();

                this._state = this.STATE.NONE;

                this.domElement.removeEventListener('mousemove', this.mousemoveFnc);
                this.domElement.removeEventListener('mouseup', this.mouseupFnc);
            };

            /*
            */
            TrackballControls.prototype.mousewheel = function (event) {
                if (this.enabled === false)
                    return;

                event.preventDefault();
                event.stopPropagation();

                var delta = 0;

                if (event.wheelDelta) {
                    delta = event.wheelDelta / 40;
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }

                this._zoomStart.y += (1 / delta) * this.wheelSpeed;
            };

            /*
            */
            TrackballControls.prototype.touchstart = function (event) {
                if (this.enabled === false)
                    return;

                switch (event.touches.length) {
                    case 1:
                        this._state = this.STATE.TOUCH_ROTATE;
                        this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                        break;

                    case 2:
                        this._state = this.STATE.TOUCH_ZOOM;
                        var dx = event.touches[0].pageX - event.touches[1].pageX;
                        var dy = event.touches[0].pageY - event.touches[1].pageY;
                        this._touchZoomDistanceEnd = this._touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                        break;

                    case 3:
                        this._state = this.STATE.TOUCH_PAN;
                        this._panStart = this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                        break;

                    default:
                        this._state = this.STATE.NONE;
                }
            };

            /*
            */
            TrackballControls.prototype.touchmove = function (event) {
                if (this.enabled === false)
                    return;

                event.preventDefault();
                event.stopPropagation();

                switch (event.touches.length) {
                    case 1:
                        this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                        break;

                    case 2:
                        var dx = event.touches[0].pageX - event.touches[1].pageX;
                        var dy = event.touches[0].pageY - event.touches[1].pageY;
                        this._touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                        break;

                    case 3:
                        this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                        break;

                    default:
                        this._state = this.STATE.NONE;
                }
            };

            /*
            */
            TrackballControls.prototype.touchend = function (event) {
                if (this.enabled === false)
                    return;

                switch (event.touches.length) {
                    case 1:
                        this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                        break;

                    case 2:
                        this._touchZoomDistanceStart = this._touchZoomDistanceEnd = 0;
                        break;

                    case 3:
                        this._panStart = this._panEnd = this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                        break;
                }

                this._state = this.STATE.NONE;
            };
            return TrackballControls;
        })(kurst.event.EventDispatcher);
        threejs.TrackballControls = TrackballControls;
    })(kurst.threejs || (kurst.threejs = {}));
    var threejs = kurst.threejs;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="Detector.ts" />
    /// <reference path="TrackballControls.ts" />
    /// <reference path="../events/EventDispatcher.ts" />
    /**
    * Notes:
    **
    *      var canvas  : HTMLCanvasElement         = <HTMLCanvasElement>document.createElement("canvas");
    *      var context : any                       = this.createCanvas().getContext("experimental-webgl");
    *      var gl      : WebGLRenderingContext     = <WebGLRenderingContext> context;
    *      canvas.getContext('webgl');
    */
    /**
    * @author Karim Beyrouti / http://kurst.co.uk
    */
    (function (threejs) {
        var ThreeJSWebGLView = (function (_super) {
            __extends(ThreeJSWebGLView, _super);
            //------------------------------------------------------------------------
            function ThreeJSWebGLView() {
                var _this = this;
                _super.call(this);
                this.clearColor = 0x000000;
                this.trackControlEnabled = false;
                this.renderFlag = false;
                //------------------------------------------------------------------------
                this.resizeEvent = new kurst.event.Event('resize');

                this.initThreeJSWebGLView();
                window.addEventListener('resize', function (event) {
                    return _this.onWindowResize(event);
                }, false);
            }
            //------------------------------------------------------------------------
            /*
            */
            ThreeJSWebGLView.prototype.enableTrackBall = function (flag) {
                if (flag) {
                    this.trackControls = new kurst.threejs.TrackballControls(this.camera);
                    this.trackControls.rotateSpeed = 1.0;
                    this.trackControls.zoomSpeed = 1.2;
                    this.trackControls.panSpeed = 0.8;
                    this.trackControls.noZoom = false;
                    this.trackControls.noPan = true;
                    this.trackControls.staticMoving = false;
                    this.trackControls.dynamicDampingFactor = 0.1;
                    this.trackControls.zoomSpeed = 0.45;
                    this.trackControls.addEventListener('change', this.controlChange);
                }

                this.trackControlEnabled = flag;
            };

            /*
            */
            ThreeJSWebGLView.prototype.render = function () {
                if (this.trackControlEnabled) {
                    if (this.trackControls) {
                        this.trackControls.update();
                    }
                }

                this.renderer.render(this.scene, this.camera);
            };

            /*
            */
            ThreeJSWebGLView.prototype.startRender = function () {
                var _this = this;
                this.renderFlag = true;

                var updateFunc = function () {
                    _this.render();

                    if (_this.renderFlag) {
                        requestAnimationFrame(updateFunc);
                    }
                };

                requestAnimationFrame(updateFunc);
            };

            /*
            */
            ThreeJSWebGLView.prototype.stopRender = function () {
                this.renderFlag = false;
            };

            //------------------------------------------------------------------------
            /*
            */
            ThreeJSWebGLView.prototype.initThreeJSWebGLView = function () {
                this.detector = new kurst.threejs.Detector();

                this.initContainer();
                this.initScene();
                this.initRenderer();
                this.initCamera();
            };

            /*
            */
            ThreeJSWebGLView.prototype.initContainer = function () {
                this.container = document.createElement('div');
                document.body.appendChild(this.container);
            };

            /*
            */
            ThreeJSWebGLView.prototype.initScene = function () {
                this.scene = new THREE.Scene();
            };

            /*
            */
            ThreeJSWebGLView.prototype.initRenderer = function () {
                this.renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: this.clearColor });
                this.renderer.sortObjects = false;
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.container.appendChild(this.renderer.domElement);
            };

            /*
            */
            ThreeJSWebGLView.prototype.initCamera = function () {
                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
                this.camera.position.z = 1000;
            };

            //------------------------------------------------------------------------
            /*
            */
            ThreeJSWebGLView.prototype.onWindowResize = function (event) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.dispatchEvent(this.resizeEvent);
            };

            /*
            */
            ThreeJSWebGLView.prototype.controlChange = function () {
            };
            return ThreeJSWebGLView;
        })(kurst.event.EventDispatcher);
        threejs.ThreeJSWebGLView = ThreeJSWebGLView;
    })(kurst.threejs || (kurst.threejs = {}));
    var threejs = kurst.threejs;
})(kurst || (kurst = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../../../kurst/events/EventDispatcher.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            //------------------------------------------------------------------------
            var EarthSettings = (function () {
                function EarthSettings() {
                    this.normalScale = 2.5;
                    this.radius = 200;
                }
                return EarthSettings;
            })();
            assets.EarthSettings = EarthSettings;

            //------------------------------------------------------------------------
            var Earth = (function (_super) {
                __extends(Earth, _super);
                //------------------------------------------------------------------------
                function Earth(scene, earthSettings) {
                    _super.call(this);

                    this.earthSettings = earthSettings;
                    this.scene = scene;

                    this.initEarth();
                    this.initClouds();
                }
                //------------------------------------------------------------------------
                /*
                */
                Earth.prototype.initClouds = function () {
                    this.cloudsTexture = THREE.ImageUtils.loadTexture(this.earthSettings.cloudsMap); //new //this.earthTexture               = THREE.ImageUtils.loadTexture( 'media/textures/earth_day.jpg' );
                    this.cloudsMaterial = new THREE.MeshLambertMaterial({ ambient: 0xbbbbbb, map: this.cloudsTexture, side: THREE.DoubleSide });

                    this.cloudsMaterial.transparent = true;
                    this.cloudsMaterial.opacity = .9;

                    this.cloudsGeom = new THREE.SphereGeometry(this.earthSettings.radius + 2, 30, 30);
                    this.cloudsMesh = new THREE.Mesh(this.cloudsGeom, this.cloudsMaterial);
                    this.cloudsMesh.castShadow = true;
                    this.cloudsMesh.receiveShadow = true;

                    this.container.add(this.cloudsMesh);
                };

                /*
                */
                Earth.prototype.initEarth = function () {
                    var normalTexture = THREE.ImageUtils.loadTexture(this.earthSettings.earthNormal);
                    var earthTexture = THREE.ImageUtils.loadTexture(this.earthSettings.earthMap);

                    //*
                    var normalTexture = THREE.ImageUtils.loadTexture(this.earthSettings.earthNormal);
                    var earthTexture = THREE.ImageUtils.loadTexture(this.earthSettings.earthMap);

                    var shader = THREE.ShaderLib["normalmap"];
                    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

                    uniforms["enableAO"].value = false;
                    uniforms["enableDiffuse"].value = true;
                    uniforms["enableSpecular"].value = true;
                    uniforms["enableReflection"].value = false;
                    uniforms["enableDisplacement"].value = false;

                    uniforms["tNormal"].value = normalTexture;
                    uniforms["tDiffuse"].value = earthTexture;
                    uniforms["tSpecular"].value = earthTexture;

                    uniforms["uNormalScale"].value.set(this.earthSettings.normalScale, this.earthSettings.normalScale);

                    this.earthNormal = new THREE.ShaderMaterial({
                        fragmentShader: shader.fragmentShader,
                        vertexShader: shader.vertexShader,
                        uniforms: uniforms,
                        lights: true,
                        fog: false });

                    //*/
                    /*
                    var earthMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: earthTexture,
                    bumpMap: earthTexture, bumpScale: 4, specular: 0xffffff, emissive: 0x888888 } );
                    //*/
                    this.earthMeshMat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.02,
                        side: THREE.DoubleSide });

                    this.materials = [];
                    this.materials.push(this.earthNormal);
                    this.materials.push(this.earthMeshMat);

                    this.earthGeom = new THREE.SphereGeometry(this.earthSettings.radius, 40, 30);
                    this.earthGeom.computeTangents();

                    this.earth = THREE.SceneUtils.createMultiMaterialObject(this.earthGeom, this.materials);
                    this.earth.position.set(0, 0, 0);

                    this.earth.castShadow = true;
                    this.earth.receiveShadow = true;

                    this.container = new THREE.Object3D();
                    this.container.add(this.earth);

                    this.scene.add(this.container);
                };

                /*
                */
                Earth.prototype.render = function () {
                    this.cloudsMesh.rotation.y += .0001;
                };
                return Earth;
            })(kurst.event.EventDispatcher);
            assets.Earth = Earth;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../GlobeView.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            //------------------------------------------------------------------------
            var Atmosphere = (function () {
                //--------------------------------------------------------------------
                function Atmosphere(globeView, earth) {
                    this.globeView = globeView;

                    this.atmosphereMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            "c": { type: "f", value: 0.4 },
                            "p": { type: "f", value: 5.0 }
                        },
                        vertexShader: [
                            "varying vec3 vNormal;",
                            "void main(){",
                            "vNormal = normalize( normalMatrix * normal );",
                            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                            "}"
                        ].join("\n"),
                        fragmentShader: [
                            "uniform float c;",
                            "uniform float p;",
                            "varying vec3 vNormal;",
                            "void main(){",
                            "float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );",
                            "gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;",
                            "}"
                        ].join("\n")
                    });

                    this.scene = new THREE.Scene();

                    this.camera = new THREE.PerspectiveCamera(globeView.camera.fov, window.innerWidth / window.innerHeight, 1, 20000);
                    this.camera.position = globeView.camera.position;
                    this.camera.rotation = globeView.camera.rotation;
                    this.scene.add(this.camera);

                    this.atmosphereMesh = new THREE.Mesh(earth.clone(), this.atmosphereMaterial);
                    this.atmosphereMesh.scale.x = this.atmosphereMesh.scale.y = this.atmosphereMesh.scale.z = 1.2;
                    this.atmosphereMesh.material.side = THREE.BackSide;

                    this.scene.add(this.atmosphereMesh);

                    var blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                    var sphere = new THREE.Mesh(earth.clone(), blackMaterial);
                    sphere.scale.x = sphere.scale.y = sphere.scale.z = 1;
                    this.scene.add(sphere);

                    // prepare secondary composer
                    var renderTargetParameters = {
                        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
                        format: THREE.RGBFormat, stencilBuffer: false };
                    this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
                    this.composer2 = new THREE.EffectComposer(globeView.renderer, this.renderTarget);

                    //this.composer2.
                    // prepare the secondary render's passes
                    this.render2Pass = new THREE.RenderPass(this.scene, this.camera);
                    this.composer2.addPass(this.render2Pass);

                    this.finalComposer = new THREE.EffectComposer(globeView.renderer, this.renderTarget);
                    this.renderModel = new THREE.RenderPass(globeView.scene, globeView.camera);

                    this.finalComposer.addPass(this.renderModel);

                    this.effectBlend = new THREE.ShaderPass(THREE['AdditiveBlendShader'], "tDiffuse1");
                    this.effectBlend.uniforms['tDiffuse2'].value = this.composer2.renderTarget2;
                    this.effectBlend.renderToScreen = true;
                    this.finalComposer.addPass(this.effectBlend);

                    globeView.renderer.autoClear = false;
                    globeView.renderer.setClearColorHex(0x000000, 0.0);
                }
                //--------------------------------------------------------------------
                /*
                */
                Atmosphere.prototype.resize = function () {
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.updateProjectionMatrix();

                    this.renderTarget.width = window.innerWidth;
                    this.renderTarget.height = window.innerHeight;
                };

                /*
                */
                Atmosphere.prototype.render = function () {
                    this.composer2.render();
                    this.finalComposer.render();
                };
                return Atmosphere;
            })();
            assets.Atmosphere = Atmosphere;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../../../kurst/events/EventDispatcher.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            //------------------------------------------------------------------------
            var SkyboxData = (function () {
                function SkyboxData() {
                    this.size = 4000;
                }
                return SkyboxData;
            })();
            assets.SkyboxData = SkyboxData;

            //------------------------------------------------------------------------
            var Skybox = (function (_super) {
                __extends(Skybox, _super);
                //------------------------------------------------------------------------
                function Skybox(scene, data) {
                    _super.call(this);

                    this.data = data;
                    this.scene = scene;

                    this.init();
                }
                //------------------------------------------------------------------------
                /*
                */
                Skybox.prototype.init = function () {
                    var urls = [
                        this.data.path + this.data.posx + this.data.format, this.data.path + this.data.negx + this.data.format,
                        this.data.path + this.data.posy + this.data.format, this.data.path + this.data.negy + this.data.format,
                        this.data.path + this.data.posz + this.data.format, this.data.path + this.data.negz + this.data.format
                    ];

                    this.textureCube = THREE.ImageUtils.loadTextureCube(urls);

                    var shader = THREE.ShaderLib["cube"];
                    shader.uniforms["tCube"].value = this.textureCube;

                    this.materialCube = new THREE.ShaderMaterial({
                        fragmentShader: shader.fragmentShader,
                        vertexShader: shader.vertexShader,
                        uniforms: shader.uniforms,
                        depthWrite: false,
                        side: THREE.BackSide
                    });

                    this.cubeGeom = new THREE.CubeGeometry(this.data.size, this.data.size, this.data.size);
                    this.cubeMesh = new THREE.Mesh(this.cubeGeom, this.materialCube);
                    this.scene.add(this.cubeMesh);
                };
                return Skybox;
            })(kurst.event.EventDispatcher);
            assets.Skybox = Skybox;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../../../kurst/events/EventDispatcher.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            var StarFieldData = (function () {
                function StarFieldData() {
                    this.fieldWidth = 3800;
                    this.fieldHeight = 3800;
                    this.fieldDepth = 3800;
                    this.excludeBounds = 400;
                    this.opacity = .35;
                    this.size = 1;
                    this.numParticles = 4000;
                }
                return StarFieldData;
            })();
            assets.StarFieldData = StarFieldData;

            //------------------------------------------------------------------------
            var StarField = (function (_super) {
                __extends(StarField, _super);
                //------------------------------------------------------------------------
                function StarField(scene, data) {
                    _super.call(this);

                    if (data === undefined) {
                        data = new apps.globe.assets.StarFieldData();
                    }

                    this.data = data;
                    this.scene = scene;

                    this.init();
                }
                //------------------------------------------------------------------------
                /*
                */
                StarField.prototype.init = function () {
                    this.geometry = new THREE.Geometry();

                    var fieldWidth = this.data.fieldWidth;
                    var fieldHeight = this.data.fieldHeight;
                    var fieldDepth = this.data.fieldDepth;
                    var excludeBounds = this.data.excludeBounds;

                    for (var i = 0; i < this.data.numParticles; i++) {
                        var dx = Math.random() * fieldWidth - fieldWidth / 2;
                        var dy = Math.random() * fieldHeight - fieldHeight / 2;
                        var dz = Math.random() * fieldDepth - fieldDepth / 2;

                        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                        if (dist > excludeBounds) {
                            var vertex = new THREE.Vector3();
                            vertex.x = dx;
                            vertex.y = dy;
                            vertex.z = dz;
                            this.geometry.vertices.push(vertex);
                        }
                    }

                    this.particleMat = new THREE.ParticleBasicMaterial({ size: this.data.size });
                    this.particleMat.color.setRGB(25, 25, 25); // = 0xffffff;
                    this.particleMat.opacity = this.data.opacity; //.5;//.5;
                    this.particleMat.transparent = true;

                    this.particles = new THREE.ParticleSystem(this.geometry, this.particleMat);

                    this.scene.add(this.particles);
                };
                return StarField;
            })(kurst.event.EventDispatcher);
            assets.StarField = StarField;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/ax.d.ts" />
var kurst;
(function (kurst) {
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (utils) {
        var JSUtils = (function () {
            function JSUtils() {
            }
            //--------------------------------------------------------------------------
            /*
            */
            JSUtils.isFireFox = function () {
                return (navigator.userAgent.search("Firefox") != -1);
            };

            /*
            */
            JSUtils.isIE = function () {
                return (navigator.appVersion.indexOf("MSIE") != -1);
            };

            /*
            */
            JSUtils.getIEVersion = function () {
                if (JSUtils.isIE()) {
                    return parseFloat(navigator.appVersion.split("MSIE")[1]);
                }

                return -1;
            };

            /*
            */
            JSUtils.isFlashEnabled = function () {
                if (JSUtils.isIE()) {
                    var version = JSUtils.getIEVersion();

                    if (version > 8) {
                        return (window['ActiveXObject'] && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false);
                    } else {
                        try  {
                            var aXObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

                            if (aXObj) {
                                return true;
                            }

                            return false;
                        } catch (ex) {
                            return false;
                        }
                    }

                    return false;
                } else {
                    return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") != false);
                }
            };
            return JSUtils;
        })();
        utils.JSUtils = JSUtils;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../../../kurst/events/EventDispatcher.ts" />
        /// <reference path="../../../kurst/utils/JSUtils.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            //------------------------------------------------------------------------
            var SunData = (function () {
                function SunData() {
                    this.textureFlare = "media/textures/flare/bright-sun.png";
                    this.textureFlare10 = "media/textures/flare/flare10.jpg";
                    this.textureFlare11 = "media/textures/flare/flare11.jpg";
                    this.textureFlare7 = "media/textures/flare/flare7.jpg";
                    this.textureFlare12 = "media/textures/flare/flare12.jpg";
                    this.textureFlare6 = "media/textures/flare/flare6.jpg";
                    this.textureFlare2 = "media/textures/flare/flare2.jpg";
                    this.textureFlare3 = "media/textures/flare/flare3.jpg";
                    this.textureFlare4 = "media/textures/flare/flare4.jpg";
                    this.textureFlare8 = "media/textures/flare/flare8.jpg";
                    this.sunMap = "media/textures/flare/sunmap.png";
                    this.enableFlare = true;
                }
                return SunData;
            })();
            assets.SunData = SunData;

            //------------------------------------------------------------------------
            var Sun = (function (_super) {
                __extends(Sun, _super);
                //------------------------------------------------------------------------
                function Sun(scene, light, sunData) {
                    _super.call(this);

                    if (sunData === undefined) {
                        sunData = new apps.globe.assets.SunData();
                    }

                    this.sunData = sunData;
                    this.scene = scene;
                    this.light = light;

                    if (!kurst.utils.JSUtils.isFireFox()) {
                        if (this.sunData.enableFlare) {
                            this.initFlare();
                        }
                    }

                    this.initSun();
                }
                //------------------------------------------------------------------------
                /*
                */
                Sun.prototype.initFlare = function () {
                    var textureFlare = THREE.ImageUtils.loadTexture(this.sunData.textureFlare);
                    var textureFlare10 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare10);
                    var textureFlare11 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare11);
                    var textureFlare7 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare7);
                    var textureFlare12 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare12);
                    var textureFlare6 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare6);
                    var textureFlare2 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare2);
                    var textureFlare3 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare3);
                    var textureFlare4 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare4);
                    var textureFlare8 = THREE.ImageUtils.loadTexture(this.sunData.textureFlare8);

                    var flareColor = new THREE.Color(0xffffff);
                    var opacity = .103;

                    this.lensFlare = new THREE.LensFlare(undefined, 300, 0, THREE.AdditiveBlending, flareColor);

                    this.lensFlare.add(textureFlare, 200, -0.04, THREE.AdditiveBlending, flareColor, 1);
                    this.lensFlare.add(textureFlare10, 160, -0.01, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare11, 460, 0, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare7, 360, 0, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare12, 100, .1, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare12, 50, .2, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare2, 250, .3, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare6, 150, .58, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare3, 175, .7, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare4, 240, .8, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare8, 100, .9, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare6, 350, 1, THREE.AdditiveBlending, flareColor, opacity);
                    this.lensFlare.add(textureFlare7, 650, 1.5, THREE.AdditiveBlending, flareColor, opacity);

                    this.lensFlare.position = this.light.position;
                    this.lensFlare.position.x -= 500;

                    this.scene.add(this.lensFlare);
                };

                /*
                */
                Sun.prototype.initSun = function () {
                    var sunTexture = THREE.ImageUtils.loadTexture(this.sunData.sunMap);

                    var sunPhong = new THREE.MeshPhongMaterial({ map: sunTexture });
                    sunPhong.emissive = new THREE.Color(0xffffff);

                    var sunMaterial = new THREE.MeshLambertMaterial({ map: sunTexture });
                    sunMaterial.ambient = new THREE.Color(0xffffff);
                    sunMaterial.blending = THREE.AdditiveBlending;

                    var sunGeom = new THREE.SphereGeometry(140, 16, 16);
                    var sunMesh = new THREE.Mesh(sunGeom, sunPhong);

                    sunMesh.position.x = this.light.position.x + 250;
                    sunMesh.position.y = this.light.position.y;
                    sunMesh.position.z = this.light.position.z;

                    this.scene.add(sunMesh);
                };
                return Sun;
            })(kurst.event.EventDispatcher);
            assets.Sun = Sun;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var apps;
(function (apps) {
    (function (globe) {
        /// <reference path="../../../kurst/events/EventDispatcher.ts" />
        /// <reference path="../../../libs/maps/three.d.ts" />
        /*
        * Author: Karim Beyrouti ( karim@kurst.co.uk )
        */
        (function (assets) {
            //------------------------------------------------------------------------
            var SkyGrid = (function (_super) {
                __extends(SkyGrid, _super);
                //------------------------------------------------------------------------
                function SkyGrid(scene) {
                    _super.call(this);

                    this.scene = scene;

                    this.initGrid();
                }
                //------------------------------------------------------------------------
                /*
                */
                SkyGrid.prototype.initGrid = function () {
                    this.earthGridMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.015 }); //new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: this.map, side: THREE.DoubleSide } );

                    this.materials = [];
                    this.materials.push(this.earthGridMat);

                    this.gridGeom = new THREE.SphereGeometry(4000, 60, 40);
                    this.gridGeom.computeTangents();

                    this.gridMesh = THREE.SceneUtils.createMultiMaterialObject(this.gridGeom, this.materials);
                    this.gridMesh.position.set(0, 0, 0);

                    this.scene.add(this.gridMesh);
                };
                return SkyGrid;
            })(kurst.event.EventDispatcher);
            assets.SkyGrid = SkyGrid;
        })(globe.assets || (globe.assets = {}));
        var assets = globe.assets;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var apps;
(function (apps) {
    /// <reference path="../../kurst/threejs/OrbitControls.ts" />
    /// <reference path="../../kurst/data/GeoData.ts" />
    /// <reference path="../../kurst/threejs/ThreeJSWebGLView.ts" />
    /// <reference path="../../libs/maps/three.d.ts" />
    /// <reference path="assets/Earth.ts" />
    /// <reference path="assets/Atmosphere.ts" />
    /// <reference path="assets/Skybox.ts" />
    /// <reference path="assets/StarField.ts" />
    /// <reference path="assets/Sun.ts" />
    /// <reference path="assets/SkyGrid.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (globe) {
        var GlobeView = (function (_super) {
            __extends(GlobeView, _super);
            //------------------------------------------------------------------------
            function GlobeView() {
                var _this = this;
                _super.call(this);
                this.markerCounter = 0;

                this.markers = [];

                this.defaultMarker = new apps.globe.MarkerSettings();
                this.defaultMarker.material = new THREE.MeshBasicMaterial({ color: 0xffea00 });
                this.defaultMarker.geom = new THREE.TetrahedronGeometry(.8, 2);

                this.initGlobeView();
                this.addEventListener(this.resizeEvent.type, function (event) {
                    return _this.onResizeHandler(event);
                });
            }
            //------------------------------------------------------------------------
            /*
            * Add a marker at the specified geo coordinated
            */
            GlobeView.prototype.addMarker = function (data, marker) {
                if (data.latitude === 0 || data.longitude === 0 || data.longitude === undefined || data.latitude === undefined) {
                    return;
                }

                if (marker === undefined) {
                    marker = this.defaultMarker;
                }

                var mesh = new THREE.Mesh(marker.geom, marker.material);
                mesh.position = this.translateGeoCoords(data.latitude, data.longitude, this.earthSettings.radius + 5);
                mesh.lookAt(this.earth.container.position);

                var markerVO = new MarkerVO();
                markerVO.id = this.markerCounter++;
                markerVO.mesh = mesh;
                markerVO.data = data;

                this.markers.push(markerVO);
                this.earth.container.add(mesh);
            };

            //------------------------------------------------------------------------
            /*
            * Translate Lat / Long to Vector3
            */
            GlobeView.prototype.translateGeoCoords = function (latitude, longitude, radius) {
                var phi = (latitude) * Math.PI / 180;
                var theta = (longitude - 180) * Math.PI / 180;

                var x = -(radius) * Math.cos(phi) * Math.cos(theta);
                var y = (radius) * Math.sin(phi);
                var z = (radius) * Math.cos(phi) * Math.sin(theta);

                return new THREE.Vector3(x, y, z);
            };

            /*
            * Render the globe
            */
            GlobeView.prototype.render = function () {
                this.earth.container.rotation.y += .0006;
                this.earth.render();
                this.orbitControl.update();
                this.renderer.render(this.scene, this.camera);

                if (this.composer) {
                    this.renderer.clear();
                    this.composer.render(.015);
                }

                if (this.atmos) {
                    this.atmos.render();
                }

                if (this.composer) {
                    this.composer.render();
                }
            };

            //------------------------------------------------------------------------
            /*
            */
            GlobeView.prototype.initGlobeView = function () {
                this.initLights();
                this.initLensFlare();
                this.initEarth();
                this.initSkybox();
                this.startRender();
                this.initStarField();
                this.initOrbitControls();
                this.initAtmosphere();

                //this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0125 );
                this.scene.fog = new THREE.FogExp2(0xffffff, 0.0007);
                /*
                var renderModel = new THREE.RenderPass( this.scene, this.camera );
                var effectBloom = new THREE.BloomPass( 1.15 , 15 );
                var effectCopy = new THREE.ShaderPass( THREE['CopyShader'] );
                effectCopy.renderToScreen = true;
                this.composer = new THREE.EffectComposer( this.renderer );
                this.composer.addPass( renderModel );
                this.composer.addPass( effectBloom );
                this.composer.addPass( effectCopy );
                //*/
            };

            /*
            * Initialise the Atmosphere
            */
            GlobeView.prototype.initAtmosphere = function () {
                this.atmos = new apps.globe.assets.Atmosphere(this, this.earth.earthGeom);
            };

            /*
            * Initialise the Orbit controls
            */
            GlobeView.prototype.initOrbitControls = function () {
                this.orbitControl = new kurst.threejs.OrbitControls(this.camera);
                this.orbitControl.autoRotate = true;
                this.orbitControl.autoRotateSpeed = .15;
                this.orbitControl.maxDistance = 2500;
                this.orbitControl.minDistance = 600;
            };

            /*
            * Initialise the Lens Flare
            */
            GlobeView.prototype.initLensFlare = function () {
                this.sun = new apps.globe.assets.Sun(this.scene, this.pointLight);
            };

            /*
            * Initialise the SkyBox
            */
            GlobeView.prototype.initSkybox = function () {
                var data = new apps.globe.assets.SkyboxData();
                data.path = 'media/textures/skybox/';
                data.format = '.jpg';
                data.posx = 'spacescape_right1';
                data.negx = 'spacescape_left2';
                data.posy = 'spacescape_top3';
                data.negy = 'spacescape_bottom4';
                data.posz = 'spacescape_front5';
                data.negz = 'spacescape_back6';

                this.skybox = new apps.globe.assets.Skybox(this.scene, data);
                this.skyGrid = new apps.globe.assets.SkyGrid(this.scene);
            };

            /*
            * Initialise the Lights
            */
            GlobeView.prototype.initLights = function () {
                this.ambientLight = new THREE.AmbientLight(0x444444);

                this.scene.add(this.ambientLight);

                this.pointLight = new THREE.PointLight(0xffffff, 3, 3000);
                this.pointLight.lookAt(new THREE.Vector3(0, 0, 0));
                this.pointLight.position.set(2800, 0, 0);

                this.scene.add(this.pointLight);
            };

            /*
            * Initialise the Star Field
            */
            GlobeView.prototype.initStarField = function () {
                this.starField = new apps.globe.assets.StarField(this.scene);
            };

            /*
            * Initialise the Earth Globe
            */
            GlobeView.prototype.initEarth = function () {
                this.earthSettings = new apps.globe.assets.EarthSettings();
                this.earthSettings.earthMap = 'media/textures/earth_day.jpg';
                this.earthSettings.earthNight = 'media/textures/earth_night.jpg';
                this.earthSettings.earthNormal = 'media/textures/earth_normal.jpg';
                this.earthSettings.cloudsMap = 'media/textures/earth_clouds.png';
                this.earthSettings.earthAO = 'media/textures/earth_normal_OCC.png';

                this.earth = new apps.globe.assets.Earth(this.scene, this.earthSettings);
            };

            //------------------------------------------------------------------------
            /*
            * Resize Event Handler
            */
            GlobeView.prototype.onResizeHandler = function (event) {
                if (this.atmos) {
                    this.atmos.resize();
                }
            };
            return GlobeView;
        })(kurst.threejs.ThreeJSWebGLView);
        globe.GlobeView = GlobeView;

        //------------------------------------------------------------------------
        var MarkerSettings = (function () {
            function MarkerSettings() {
            }
            return MarkerSettings;
        })();
        globe.MarkerSettings = MarkerSettings;

        //------------------------------------------------------------------------
        var MarkerVO = (function () {
            function MarkerVO() {
            }
            return MarkerVO;
        })();
        globe.MarkerVO = MarkerVO;
    })(apps.globe || (apps.globe = {}));
    var globe = apps.globe;
})(apps || (apps = {}));
var kurst;
(function (kurst) {
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (core) {
        var UIBase = (function () {
            //------------------------------------------------------------------------
            function UIBase() {
            }
            //------------------------------------------------------------------------
            /*
            */
            UIBase.prototype.getId = function (id) {
                return document.getElementById(id);
            };

            /*
            */
            UIBase.prototype.getClass = function (className) {
                return document.getElementsByClassName(className);
            };

            /*
            */
            UIBase.prototype.getElementsByClassNme = function (theClass) {
                var classElms = new Array();
                var node = document;

                var i = 0;

                if (node.getElementsByClassName) {
                    var tempEls = node.getElementsByClassName(theClass);

                    for (i = 0; i < tempEls.length; i++) {
                        classElms.push(tempEls[i]);
                    }
                } else {
                    var getclass = new RegExp('\\b' + theClass + '\\b');
                    var elems = node.getElementsByTagName('*');

                    for (i = 0; i < elems.length; i++) {
                        var classes = elems[i]['className'];

                        if (getclass.test(classes)) {
                            classElms.push(elems[i]);
                        }
                    }
                }

                return classElms;
            };
            return UIBase;
        })();
        core.UIBase = UIBase;
    })(kurst.core || (kurst.core = {}));
    var core = kurst.core;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /// <reference path="JSonLoader.ts" />
    /// <reference path="GeoData.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (data) {
        //------------------------------------------------------------------------------------------
        var IPGeoCoder = (function (_super) {
            __extends(IPGeoCoder, _super);
            //------------------------------------------------------------------------
            function IPGeoCoder(apikey) {
                var _this = this;
                _super.call(this);
                this.useProxy = true;
                this.proxy = 'proxy.php';
                this.proxyParam = 'url';
                //------------------------------------------------------------------------
                this.LOAD_SUCCESS = new kurst.event.Event('IPGeoCoder_loaded');
                this.LOAD_ERROR = new kurst.event.Event('IPGeoCoder_loadfailed');

                this.apikey = apikey;
                this.jsonLoader = new kurst.data.JSonLoader();

                this.jsonLoader.addEventListener(this.jsonLoader.LOAD_ERROR.type, function (event) {
                    return _this.jsonLoadFail();
                });
                this.jsonLoader.addEventListener(this.jsonLoader.LOAD_SUCCESS.type, function (event) {
                    return _this.jsonLoaded();
                });
            }
            //------------------------------------------------------------------------
            /*
            */
            IPGeoCoder.prototype.locateIP = function (ip) {
                var uri = 'http://api.ipinfodb.com/v3/ip-city/?key=' + this.apikey + '&ip=' + ip + '&format=json';

                if (this.useProxy) {
                    uri = this.proxy + '?' + this.proxyParam + '=' + encodeURIComponent(uri);
                }

                this.jsonLoader.loadJson(uri);
            };

            /*
            */
            IPGeoCoder.prototype.enableProxy = function (flag, uri, param) {
                this.useProxy = flag;
                this.proxy = uri;
                this.proxyParam = param;
            };

            /*
            */
            IPGeoCoder.prototype.getLocationData = function () {
                return this.data;
            };

            //------------------------------------------------------------------------
            /*
            */
            IPGeoCoder.prototype.jsonLoaded = function () {
                var json = this.jsonLoader.getData();

                this.data = new kurst.data.GeoData();
                this.data.statusCode = json['statusCode'];
                this.data.statusMessage = json['statusMessage'];
                this.data.ipAddress = json['ipAddress'];
                this.data.countryCode = json['countryCode'];
                this.data.countryName = json['countryName'];
                this.data.regionName = json['regionName'];
                this.data.cityName = json['cityName'];
                this.data.zipCode = json['zipCode'];
                this.data.latitude = parseFloat(json['latitude']);
                this.data.longitude = parseFloat(json['longitude']);
                this.data.timeZone = json['timeZone'];

                this.dispatchEvent(this.LOAD_SUCCESS);
            };

            /*
            */
            IPGeoCoder.prototype.jsonLoadFail = function () {
                this.dispatchEvent(this.LOAD_ERROR);
            };
            return IPGeoCoder;
        })(kurst.event.EventDispatcher);
        data.IPGeoCoder = IPGeoCoder;
    })(kurst.data || (kurst.data = {}));
    var data = kurst.data;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (data) {
        var DataLoader = (function (_super) {
            __extends(DataLoader, _super);
            //--------------------------------------------------------------------------
            function DataLoader() {
                _super.call(this);
                //------------------------------------------------------------------------
                this.LOAD_SUCCESS = new kurst.event.Event('DataSender_loaded');
                this.LOAD_ERROR = new kurst.event.Event('DataSender_loadfailed');
                this.loader = new XMLHttpRequest();
            }
            //--------------------------------------------------------------------------
            /*
            * Load a JSON data file
            */
            DataLoader.prototype.loadData = function (uri) {
                if (!this.loader) {
                    this.loader = new XMLHttpRequest();
                }

                var controller = this;

                this.loader.open('GET', uri, true);
                this.loader.onload = function (event) {
                    controller.onLoadComplete(event);
                };
                this.loader.onerror = function (event) {
                    controller.onLoadError(event);
                };
                this.loader.responseType = 'text';

                this.loader.send();
            };

            /*
            * Get data
            */
            DataLoader.prototype.getData = function () {
                return this.data;
            };

            //--------------------------------------------------------------------------
            /*
            * Data load completed
            */
            DataLoader.prototype.onLoadComplete = function (event) {
                var xhr = event['currentTarget'];

                try  {
                    this.data = xhr.responseText;

                    this.dispatchEvent(this.LOAD_SUCCESS);
                } catch (e) {
                    this.data = xhr.responseText;
                    this.dispatchEvent(this.LOAD_ERROR);
                }
            };

            /*
            * Data load error
            */
            DataLoader.prototype.onLoadError = function (event) {
                var xhr = event['currentTarget'];
                xhr.abort();

                this.dispatchEvent(this.LOAD_ERROR);
            };
            return DataLoader;
        })(kurst.event.EventDispatcher);
        data.DataLoader = DataLoader;
    })(kurst.data || (kurst.data = {}));
    var data = kurst.data;
})(kurst || (kurst = {}));
/*
* Credits: Christophe Porteneuve ( https://github.com/tdd )
*          Karim Beyrouti - typescript conversion - karim@kurst.co.uk
*/
var kurst;
(function (kurst) {
    (function (utils) {
        var CookiesUtil = (function () {
            function CookiesUtil() {
            }
            //------------------------------------------------------------------------------------------
            /*
            */
            CookiesUtil.get = function (name) {
                return CookiesUtil.has(name) ? CookiesUtil.list()[name] : null;
            };

            /*
            */
            CookiesUtil.has = function (name) {
                var cookieStr = document.cookie;
                return new RegExp("(?:;\\s*|^)" + encodeURIComponent(name) + '=').test(cookieStr);
            };

            /*
            */
            CookiesUtil.list = function (nameRegExp) {
                var pairs = document.cookie.split(';'), pair, result = {};

                for (var index = 0, len = pairs.length; index < len; ++index) {
                    pair = pairs[index].split('=');
                    pair[0] = pair[0].replace(/^\s+|\s+$/, '');

                    if (!CookiesUtil.isRegExp(nameRegExp) || nameRegExp.test(pair[0]))
                        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }

                return result;
            };

            /*
            */
            CookiesUtil.set = function (name, value, options) {
                options = options || {};

                var def = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];

                if (options.path) {
                    def.push('path=' + options.path);
                }
                if (options.domain) {
                    def.push('domain=' + options.domain);
                }

                var maxAge = 'maxAge' in options ? options.maxAge : ('max_age' in options ? options['max_age'] : options['max-age']), maxAgeNbr;

                if ('undefined' != typeof maxAge && 'null' != typeof maxAge && (!isNaN(maxAgeNbr = parseFloat(maxAge))))
                    def.push('max-age=' + maxAgeNbr);

                var expires = CookiesUtil.isDate(options.expires) ? options.expires.toUTCString() : options.expires;

                if (expires) {
                    def.push('expires=' + expires);
                }

                if (options['secure']) {
                    def.push('secure');
                }

                var str = def.join(';');

                document.cookie = str;

                return def;
            };

            /*
            */
            CookiesUtil.remove = function (name, options) {
                var opt2 = {};

                for (var key in (options || {})) {
                    opt2[key] = options[key];
                }

                opt2['expires'] = new Date(0);
                opt2['maxAge'] = -1;
                return CookiesUtil.set(name, null, opt2);
            };

            //------------------------------------------------------------------------------------------
            /*
            */
            CookiesUtil.isRegExp = function (o) {
                return '[object RegExp]' == Object.prototype.toString.call(o);
            };

            /*
            */
            CookiesUtil.isDate = function (o) {
                return '[object RegExp]' == Object.prototype.toString.call(o);
            };
            return CookiesUtil;
        })();
        utils.CookiesUtil = CookiesUtil;
    })(kurst.utils || (kurst.utils = {}));
    var utils = kurst.utils;
})(kurst || (kurst = {}));
var kurst;
(function (kurst) {
    /// <reference path="../events/EventDispatcher.ts" />
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (_data) {
        var DataSender = (function (_super) {
            __extends(DataSender, _super);
            //--------------------------------------------------------------------------
            function DataSender() {
                _super.call(this);
                //------------------------------------------------------------------------
                this.LOAD_SUCCESS = new kurst.event.Event('DataSender_loaded');
                this.LOAD_ERROR = new kurst.event.Event('DataSender_loadfailed');

                this.loader = new XMLHttpRequest();
            }
            //--------------------------------------------------------------------------
            /*
            * Load a JSON data file
            */
            DataSender.prototype.sendData = function (uri, data) {
                if (!this.loader) {
                    this.loader = new XMLHttpRequest();
                }

                var controller = this;

                this.loader.open('POST', uri, true);
                this.loader.onload = function (event) {
                    controller.onLoadComplete(event);
                };
                this.loader.onerror = function (event) {
                    controller.onLoadError(event);
                };
                this.loader.responseType = 'text';

                this.loader.send(data);
            };

            /*
            * Get data
            */
            DataSender.prototype.getData = function () {
                return this.data;
            };

            //--------------------------------------------------------------------------
            /*
            * Data load completed
            */
            DataSender.prototype.onLoadComplete = function (event) {
                var xhr = event['currentTarget'];

                try  {
                    this.data = xhr.responseText;
                    this.dispatchEvent(this.LOAD_SUCCESS);
                } catch (e) {
                    this.data = xhr.responseText;
                    this.dispatchEvent(this.LOAD_ERROR);
                }
            };

            /*
            * Data load error
            */
            DataSender.prototype.onLoadError = function (event) {
                var xhr = event['currentTarget'];
                xhr.abort();
                this.dispatchEvent(this.LOAD_ERROR);
            };
            return DataSender;
        })(kurst.event.EventDispatcher);
        _data.DataSender = DataSender;
    })(kurst.data || (kurst.data = {}));
    var data = kurst.data;
})(kurst || (kurst = {}));
/// <reference path="../globe/GlobeView.ts" />
/// <reference path="../../kurst/core/UIBase.ts" />
/// <reference path="../../kurst/data/IPGeoCoder.ts" />
/// <reference path="../../kurst/data/DataLoader.ts" />
/// <reference path="../../kurst/utils/CookiesUtil.ts" />
/// <reference path="../../kurst/threejs/Detector.ts" />
/// <reference path="../../kurst/data/DataSender.ts" />
var apps;
(function (apps) {
    /*
    * Author: Karim Beyrouti ( karim@kurst.co.uk )
    */
    (function (controller) {
        var GlobeController = (function (_super) {
            __extends(GlobeController, _super);
            //------------------------------------------------------------------------------
            function GlobeController() {
                var _this = this;
                _super.call(this);
                //------------------------------------------------------------------------------
                this.debug = false;
                this.geoCookieName = 'GeoCookie_dataSent';
                //------------------------------------------------------------------------------
                this.IPGeoCoderKEY = '';

                this.detector = new kurst.threejs.Detector();

                if (this.detector.webgl) {
                    // Globe View
                    this.globe = new apps.globe.GlobeView();

                    //---------------------------------
                    // IP Geo Coder ( Geo locate an IP address )
                    this.ipGeoCoder = new kurst.data.IPGeoCoder(this.IPGeoCoderKEY);
                    this.ipGeoCoder.addEventListener(this.ipGeoCoder.LOAD_ERROR.type, function (event) {
                        return _this.onGeoCodeInfoLoadError();
                    });
                    this.ipGeoCoder.addEventListener(this.ipGeoCoder.LOAD_SUCCESS.type, function (event) {
                        return _this.onGeoCodeInfoLoaded();
                    });

                    //---------------------------------
                    // DataLoader - Get user's IP ( from Php )
                    //if (  kurst.utils.CookiesUtil.get( this.geoCookieName ) !== 'true') {
                    this.ipLoader = new kurst.data.DataLoader();
                    this.ipLoader.addEventListener(this.ipLoader.LOAD_ERROR.type, function (event) {
                        return _this.ipLoadFailed();
                    });
                    this.ipLoader.addEventListener(this.ipLoader.LOAD_SUCCESS.type, function (event) {
                        return _this.ipLoaded();
                    });
                    this.ipLoader.loadData('getIP.php?' + String(Math.random()));

                    //}
                    //---------------------------------
                    // Data Loader - Load stored IP addresses
                    this.ipGroupLoader = new kurst.data.DataLoader();
                    this.ipGroupLoader.addEventListener(this.ipGroupLoader.LOAD_ERROR.type, function (event) {
                        return _this.ipGroupDataLoadFailed();
                    });
                    this.ipGroupLoader.addEventListener(this.ipGroupLoader.LOAD_SUCCESS.type, function (event) {
                        return _this.ipGroupDataLoaded();
                    });
                    this.ipGroupLoader.loadData('data.txt?' + String(Math.random()));
                } else {
                    this.detector.addGetWebGLMessage(); // No WebGL support
                }
            }
            //------------------------------------------------------------------------------
            /*
            * User's IP Address Loaded
            */
            GlobeController.prototype.ipLoaded = function () {
                if (this.debug) {
                    this.ipGeoCoder.locateIP('81.97.40.44');
                } else {
                    this.ipGeoCoder.locateIP(this.ipLoader.getData());
                }
            };

            /*
            * Users IP Geo located
            */
            GlobeController.prototype.onGeoCodeInfoLoaded = function () {
                var locationData = this.ipGeoCoder.getLocationData();

                //if (  kurst.utils.CookiesUtil.get( this.geoCookieName ) !== 'true') {
                this.ipSender = new kurst.data.DataSender();

                var formData = new FormData();
                formData.append('lat', String(locationData.latitude));
                formData.append('long', String(locationData.longitude));
                formData.append('country', String(locationData.countryName));
                formData.append('city', String(locationData.cityName));

                this.ipSender.sendData('saveData.php', formData);

                // kurst.utils.CookiesUtil.set( this.geoCookieName , 'true' );
                //}
                this.globe.addMarker(locationData);
            };

            /*
            * Saved IP addresses data loaded
            */
            GlobeController.prototype.ipGroupDataLoaded = function () {
                var loadedData = this.ipGroupLoader.getData();
                var loadedDataArray = loadedData.split('\n');
                var l = loadedDataArray.length;
                var entry;
                var locationData = new kurst.data.GeoData();
                var str;

                for (var c = 0; c < l; c++) {
                    str = loadedDataArray[c];
                    entry = str.split('|');

                    locationData.longitude = entry[0];
                    locationData.latitude = entry[1];
                    locationData.countryName = entry[2];
                    locationData.cityName = entry[3];

                    this.globe.addMarker(locationData);
                }
            };

            /*
            */
            GlobeController.prototype.onGeoCodeInfoLoadError = function () {
            };

            /*
            */
            GlobeController.prototype.ipLoadFailed = function () {
            };

            /*
            */
            GlobeController.prototype.ipGroupDataLoadFailed = function () {
            };
            return GlobeController;
        })(kurst.core.UIBase);
        controller.GlobeController = GlobeController;
    })(apps.controller || (apps.controller = {}));
    var controller = apps.controller;
})(apps || (apps = {}));
/// <reference path="apps/controller/GlobeController.ts" />
// <reference path="apps/globe/GlobeView.ts" />
/*
* Author: Karim Beyrouti ( karim@kurst.co.uk )
*/
var Main;
(function (Main) {
    //--------------------------------------------------------------
    var globeController;

    //--------------------------------------------------------------
    function start() {
        globeController = new apps.controller.GlobeController(); // Start Application
    }
    Main.start = start;
})(Main || (Main = {}));

//--------------------------------------------------------------
function onWindowLoad(event) {
    Main.start();
}
function onWindowError(event) {
}

//--------------------------------------------------------------
window.onload = onWindowLoad;
window.onerror = onWindowError;
//--------------------------------------------------------------
//# sourceMappingURL=EarthMain.js.map
