var kurst;
(function (kurst) {
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
            function Detector() {
                this.canvas = !!this.createCanvas();
                this.webgl = this.testWebGlRenderingContext();
                this.workers = !!window['Worker'];
                this.fileAPI = !!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob']);
            }
            Detector.prototype.testWebGlRenderingContext = function () {
                try  {
                    var experimental = !!this.createCanvas().getContext("experimental-webgl");
                    var webGL = !!this.createCanvas().getContext("webgl");
                    return experimental || webGL;
                } catch (e) {
                    return false;
                }
            };
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
    (function (event) {
        var credits = (function () {
            function credits() {
                this.str = 'mr.doob / https://github.com/mrdoob/eventdispatcher.js/';
            }
            return credits;
        })();        
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.listeners = new Array();
            }
            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if(this.listeners[type] === undefined) {
                    this.listeners[type] = new Array();
                }
                if(this.listeners[type].indexOf(listener) === -1) {
                    this.listeners[type].push(listener);
                }
            };
            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                var index = this.listeners[type].indexOf(listener);
                if(index !== -1) {
                    this.listeners[type].splice(index, 1);
                }
            };
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var listenerArray = this.listeners[event.type];
                if(listenerArray !== undefined) {
                    this.lFncLength = listenerArray.length;
                    event.target = this;
                    for(var i = 0, l = this.lFncLength; i < l; i++) {
                        listenerArray[i].call(this, event);
                    }
                }
            };
            return EventDispatcher;
        })();
        event.EventDispatcher = EventDispatcher;        
        var Event = (function () {
            function Event(type) {
                this.type = type;
            }
            return Event;
        })();
        event.Event = Event;        
    })(kurst.event || (kurst.event = {}));
    var event = kurst.event;
})(kurst || (kurst = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var kurst;
(function (kurst) {
    (function (threejs) {
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
        var TrackballControls = (function (_super) {
            __extends(TrackballControls, _super);
            function TrackballControls(object, domElement) {
                var _this = this;
                        _super.call(this);
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
                this.STATE = new kurst.threejs.TrackballControlsState();
                this.screen = new kurst.threejs.TrackballControlsScreen();
                this._touchZoomDistanceStart = 0;
                this._touchZoomDistanceEnd = 0;
                this.changeEvent = new kurst.event.Event('change');
                this.object = object;
                this.domElement = (domElement !== undefined) ? domElement : document;
                this.radius = (this.screen.width + this.screen.height) / 4;
                this.target = new THREE.Vector3();
                this.lastPosition = new THREE.Vector3();
                this._state = this.STATE.NONE;
                this._prevState = this.STATE.NONE;
                this._eye = new THREE.Vector3() , this._rotateStart = new THREE.Vector3() , this._rotateEnd = new THREE.Vector3() , this._zoomStart = new THREE.Vector2() , this._zoomEnd = new THREE.Vector2() , this._panStart = new THREE.Vector2();
                this._panEnd = new THREE.Vector2();
                this.target0 = this.target.clone();
                this.position0 = this.object.position.clone();
                this.up0 = this.object.up.clone();
                this.keys = new Array();
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
                this.domElement.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                }, false);
                this.domElement.addEventListener('mousedown', this.mousedownFnc, false);
                this.domElement.addEventListener('mousewheel', this.mousewheelFnc, false);
                this.domElement.addEventListener('DOMMouseScroll', this.DOMMouseScrollFnc, false);
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
            TrackballControls.prototype.update = function () {
                this._eye.subVectors(this.object.position, this.target);
                if(!this.noRotate) {
                    this.rotateCamera();
                }
                if(!this.noZoom) {
                    this.zoomCamera();
                }
                if(!this.noPan) {
                    this.panCamera();
                }
                this.object.position.addVectors(this.target, this._eye);
                this.checkDistances();
                this.object.lookAt(this.target);
                if(this.lastPosition.distanceToSquared(this.object.position) > 0) {
                    this.dispatchEvent(this.changeEvent);
                    this.lastPosition.copy(this.object.position);
                }
            };
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
            TrackballControls.prototype.handleEvent = function (event) {
                if(typeof this[event.type] == 'function') {
                    this[event.type](event);
                }
            };
            TrackballControls.prototype.getMouseOnScreen = function (clientX, clientY) {
                return new THREE.Vector2((clientX - this.screen.offsetLeft) / this.radius * 0.5, (clientY - this.screen.offsetTop) / this.radius * 0.5);
            };
            TrackballControls.prototype.getMouseProjectionOnBall = function (clientX, clientY) {
                var mouseOnBall = new THREE.Vector3((clientX - this.screen.width * 0.5 - this.screen.offsetLeft) / this.radius, (this.screen.height * 0.5 + this.screen.offsetTop - clientY) / this.radius, 0.0);
                var length = mouseOnBall.length();
                if(length > 1.0) {
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
            TrackballControls.prototype.rotateCamera = function () {
                var angle = Math.acos(this._rotateStart.dot(this._rotateEnd) / this._rotateStart.length() / this._rotateEnd.length());
                if(angle) {
                    var axis = (new THREE.Vector3()).crossVectors(this._rotateStart, this._rotateEnd).normalize();
                    var quaternion = new THREE.Quaternion();
                    angle *= this.rotateSpeed;
                    quaternion.setFromAxisAngle(axis, -angle);
                    this._eye.applyQuaternion(quaternion);
                    this.object.up.applyQuaternion(quaternion);
                    this._rotateEnd.applyQuaternion(quaternion);
                    if(this.staticMoving) {
                        this._rotateStart.copy(this._rotateEnd);
                    } else {
                        quaternion.setFromAxisAngle(axis, angle * (this.dynamicDampingFactor - 1.0));
                        this._rotateStart.applyQuaternion(quaternion);
                    }
                }
            };
            TrackballControls.prototype.zoomCamera = function () {
                if(this._state === this.STATE.TOUCH_ZOOM) {
                    var factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
                    this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
                    this._eye.multiplyScalar(factor);
                } else {
                    var factor = 1.0 + (this._zoomEnd.y - this._zoomStart.y) * this.zoomSpeed;
                    if(factor !== 1.0 && factor > 0.0) {
                        this._eye.multiplyScalar(factor);
                        if(this.staticMoving) {
                            this._zoomStart.copy(this._zoomEnd);
                        } else {
                            this._zoomStart.y += (this._zoomEnd.y - this._zoomStart.y) * this.dynamicDampingFactor;
                        }
                    }
                }
            };
            TrackballControls.prototype.panCamera = function () {
                var mouseChange = this._panEnd.clone().sub(this._panStart);
                if(mouseChange.lengthSq()) {
                    mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);
                    var pan = this._eye.clone().cross(this.object.up).setLength(mouseChange.x);
                    pan.add(this.object.up.clone().setLength(mouseChange.y));
                    this.object.position.add(pan);
                    this.target.add(pan);
                    if(this.staticMoving) {
                        this._panStart = this._panEnd;
                    } else {
                        this._panStart.add(mouseChange.subVectors(this._panEnd, this._panStart).multiplyScalar(this.dynamicDampingFactor));
                    }
                }
            };
            TrackballControls.prototype.checkDistances = function () {
                if(!this.noZoom || !this.noPan) {
                    if(this.object.position.lengthSq() > this.maxDistance * this.maxDistance) {
                        this.object.position.setLength(this.maxDistance);
                    }
                    if(this._eye.lengthSq() < this.minDistance * this.minDistance) {
                        this.object.position.addVectors(this.target, this._eye.setLength(this.minDistance));
                    }
                }
            };
            TrackballControls.prototype.handleResize = function () {
                this.screen.width = window.innerWidth;
                this.screen.height = window.innerHeight;
                this.screen.offsetLeft = 0;
                this.screen.offsetTop = 0;
                this.radius = (this.screen.width + this.screen.height) / 4;
            };
            TrackballControls.prototype.keydown = function (event) {
                if(this.enabled === false) {
                    return;
                }
                console.log('keyDown');
                this._prevState = this._state;
                if(this._state !== this.STATE.NONE) {
                    return;
                } else if(event.keyCode === this.keys[this.STATE.ROTATE] && !this.noRotate) {
                    this._state = this.STATE.ROTATE;
                } else if(event.keyCode === this.keys[this.STATE.ZOOM] && !this.noZoom) {
                    this._state = this.STATE.ZOOM;
                } else if(event.keyCode === this.keys[this.STATE.PAN] && !this.noPan) {
                    this._state = this.STATE.PAN;
                }
            };
            TrackballControls.prototype.keyup = function (event) {
                if(this.enabled === false) {
                    return;
                }
                this._state = this._prevState;
            };
            TrackballControls.prototype.mousedown = function (event) {
                if(this.enabled === false) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if(this._state === this.STATE.NONE) {
                    this._state = event.button;
                }
                if(this._state === this.STATE.ROTATE && !this.noRotate) {
                    this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
                } else if(this._state === this.STATE.ZOOM && !this.noZoom) {
                    this._zoomStart = this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                } else if(this._state === this.STATE.PAN && !this.noPan) {
                    this._panStart = this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                }
                this.domElement.addEventListener('mousemove', this.mousemoveFnc, false);
                this.domElement.addEventListener('mouseup', this.mouseupFnc, false);
            };
            TrackballControls.prototype.mousemove = function (event) {
                if(this.enabled === false) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if(this._state === this.STATE.ROTATE && !this.noRotate) {
                    this._rotateEnd = this.getMouseProjectionOnBall(event.clientX, event.clientY);
                } else if(this._state === this.STATE.ZOOM && !this.noZoom) {
                    this._zoomEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                } else if(this._state === this.STATE.PAN && !this.noPan) {
                    this._panEnd = this.getMouseOnScreen(event.clientX, event.clientY);
                }
            };
            TrackballControls.prototype.mouseup = function (event) {
                if(this.enabled === false) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                this._state = this.STATE.NONE;
                this.domElement.removeEventListener('mousemove', this.mousemoveFnc);
                this.domElement.removeEventListener('mouseup', this.mouseupFnc);
            };
            TrackballControls.prototype.mousewheel = function (event) {
                if(this.enabled === false) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                var delta = 0;
                if(event.wheelDelta) {
                    delta = event.wheelDelta / 40;
                } else if(event.detail) {
                    delta = -event.detail / 3;
                }
                this._zoomStart.y += (1 / delta) * this.wheelSpeed;
            };
            TrackballControls.prototype.touchstart = function (event) {
                if(this.enabled === false) {
                    return;
                }
                switch(event.touches.length) {
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
            TrackballControls.prototype.touchmove = function (event) {
                if(this.enabled === false) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                switch(event.touches.length) {
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
            TrackballControls.prototype.touchend = function (event) {
                if(this.enabled === false) {
                    return;
                }
                switch(event.touches.length) {
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
    (function (core) {
        var UIBase = (function () {
            function UIBase() {
            }
            UIBase.prototype.getId = function (id) {
                return document.getElementById(id);
            };
            UIBase.prototype.getClass = function (className) {
                return document.getElementsByClassName(className);
            };
            UIBase.prototype.getElementsByClassNme = function (theClass) {
                var classElms = new Array();
                var node = document;
                var i = 0;
                if(node.getElementsByClassName) {
                    var tempEls = node.getElementsByClassName(theClass);
                    for(i = 0; i < tempEls.length; i++) {
                        classElms.push(tempEls[i]);
                    }
                } else {
                    var getclass = new RegExp('\\b' + theClass + '\\b');
                    var elems = node.getElementsByTagName('*');
                    for(i = 0; i < elems.length; i++) {
                        var classes = elems[i]['className'];
                        if(getclass.test(classes)) {
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
var threejs;
(function (threejs) {
    var GeomTest = (function (_super) {
        __extends(GeomTest, _super);
        function GeomTest() {
            var _this = this;
                _super.call(this);
            this.detector = new kurst.threejs.Detector();
            if(!this.detector.webgl) {
                console.log('No WebGL Support');
            } else {
                this.container = document.createElement('div');
                document.body.appendChild(this.container);
                this.initCamera();
                this.initControls();
                this.initScene();
                this.initTexture();
                this.initObjects();
                this.initRenderer();
                this.startRender();
                var controller = this;
                window.addEventListener('resize', function (event) {
                    return _this.onWindowResize(event);
                }, false);
            }
        }
        GeomTest.prototype.initCamera = function () {
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
            this.camera.position.z = 1000;
        };
        GeomTest.prototype.initControls = function () {
            this.controls = new kurst.threejs.TrackballControls(this.camera);
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.noZoom = false;
            this.controls.noPan = false;
            this.controls.staticMoving = true;
            this.controls.dynamicDampingFactor = 0.3;
            this.controls.addEventListener('change', this.controlChange);
        };
        GeomTest.prototype.initScene = function () {
            this.scene = new THREE.Scene();
            this.light = new THREE.DirectionalLight();
            this.light.position.set(0, 1, 0);
            this.scene.add(this.light);
        };
        GeomTest.prototype.initTexture = function () {
            this.map = THREE.ImageUtils.loadTexture('media/textures/ash_uvgrid01.jpg');
            this.map.wrapS = this.map.wrapT = THREE.RepeatWrapping;
            this.map.anisotropy = 16;
            this.materials = [];
            this.materials.push(new THREE.MeshLambertMaterial({
                ambient: 0xbbbbbb,
                map: this.map,
                side: THREE.DoubleSide
            }));
            this.materials.push(new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            }));
        };
        GeomTest.prototype.initRenderer = function () {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.container.appendChild(this.renderer.domElement);
        };
        GeomTest.prototype.initObjects = function () {
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(75, 20, 10), this.materials);
            this.object.position.set(-400, 0, 200);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.IcosahedronGeometry(75, 1), this.materials);
            this.object.position.set(-200, 0, 200);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.OctahedronGeometry(75, 2), this.materials);
            this.object.position.set(0, 0, 200);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.TetrahedronGeometry(75, 0), this.materials);
            this.object.position.set(200, 0, 200);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.PlaneGeometry(100, 100, 4, 4), this.materials);
            this.object.position.set(-400, 0, 0);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry(100, 100, 100, 4, 4, 4), this.materials);
            this.object.position.set(-200, 0, 0);
            this.scene.add(this.object);
            this.object = THREE.SceneUtils.createMultiMaterialObject(new THREE.CircleGeometry(50, 20, 0, Math.PI * 2), this.materials);
            this.object.position.set(0, 0, 0);
            this.scene.add(this.object);
        };
        GeomTest.prototype.startRender = function () {
            var _this = this;
            var updateFunc = function () {
                _this.render();
                requestAnimationFrame(updateFunc);
            };
            requestAnimationFrame(updateFunc);
        };
        GeomTest.prototype.controlChange = function (event) {
        };
        GeomTest.prototype.onWindowResize = function (event) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        GeomTest.prototype.render = function () {
            var timer = Date.now() * 0.0001;
            this.controls.update();
            for(var i = 0, l = this.scene.children.length; i < l; i++) {
                var object = this.scene.children[i];
                object.rotation.x = timer * 5;
                object.rotation.y = timer * 2.5;
            }
            this.renderer.render(this.scene, this.camera);
        };
        return GeomTest;
    })(kurst.core.UIBase);
    threejs.GeomTest = GeomTest;    
})(threejs || (threejs = {}));
var Main;
(function (Main) {
    var cubesTest;
    function start() {
        cubesTest = new threejs.GeomTest();
    }
    Main.start = start;
})(Main || (Main = {}));
function onWindowLoad(event) {
    Main.start();
}
function onWindowError(event) {
}
window.onload = onWindowLoad;
window.onerror = onWindowError;
//@ sourceMappingURL=GeomMain.js.map
