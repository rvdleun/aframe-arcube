const scriptLocation = document.currentScript.getAttribute('src').split('?')[0].split('/').slice(0, -1).join('/');

let test;


AFRAME.registerSystem('arcube', {
    anchor: null,
    activeMarkers: [],

    init: function() {
        const markers = [
            { id: 'a', rotation: '0 0 0' },
            { id: 'r', rotation: '0 0 180' },
            { id: 'c', rotation: '270 0 0' },
            { id: 'u', rotation: '0 270 90' },
            { id: 'b', rotation: '90 180 0' },
            { id: 'e', rotation: '0 90 270' },
        ];
        const container = document.createElement('a-entity');
        container.setAttribute('id', 'ar-cube-markers');

        markers.forEach((marker) => {
            container.innerHTML+=`<a-marker type="pattern" url="${scriptLocation}/markers/pattern-marker-${marker.id}.patt">` +
            `    <a-entity class="anchor" position="0 -.5 0" rotation="${marker.rotation}"></a-entity>` +
            '  </a-marker>'
        });

        this.el.sceneEl.appendChild(container);
    },

    addActiveMarker: function(marker) {
        if (this.activeMarkers.length === 0) {
            this.setupAnchor(marker);
        }

        this.activeMarkers.push(marker);
    },

    removeActiveMarker: function(marker) {
        if (!marker) {
            return;
        }

        if (this.activeMarkers.length > 1 && this.activeMarkers[0] === marker) {
            this.setupAnchor(this.activeMarkers[1]);
        }

        this.activeMarkers = this.activeMarkers.filter((search) => search !== marker);

        if (this.activeMarkers.length === 0){
            this.anchor = null;
        }
    },

    setupAnchor: function(marker) {
        this.anchor = marker.querySelector('.anchor');

        if (!this.anchor) {
            console.error('Unable to find anchor', marker);
        }
    },
});

AFRAME.registerComponent('arcube', {
    markerFound: null,
    markerLost: null,

    turnInvisibleAfter: 0,

    schema: {
        enabled: { type: 'boolean', default: true },
        scale: { type: 'number', default: 1.45 },
        timeout: { type: 'number', default: 500 },
    },

    init: function() {
        if (this.data.scale) {
            this.el.setAttribute('scale', `${this.data.scale} ${this.data.scale} ${this.data.scale}`);
        }

        this.el.setAttribute('visible', false);

        this.markerFound = (e) => {
            this.system.addActiveMarker(e.target);
        };
        this.markerLost = (e) => {
            this.system.removeActiveMarker(e.target);
        };

        const markers = document.querySelectorAll('a-marker');
        markers.forEach((marker) => {
            marker.addEventListener('markerFound', this.markerFound);
            marker.addEventListener('markerLost', this.markerLost);
        });
    },

    remove: function() {
        const markers = document.querySelectorAll('a-marker');
        markers.forEach((marker) => {
            marker.removeEventListener('markerFound', this.markerFound);
            marker.removeEventListener('markerLost', this.markerLost);
        });
    },

    tick: function(time) {
        if (!this.system.anchor || this.data.enabled === false) {
            if (this.el.object3D.visible && (this.data.enabled === false || this.turnInvisibleAfter < time)) {
                this.el.object3D.visible = false;
            }

            return;
        }

        const anchor3D = this.system.anchor.object3D;
        this.el.object3D.position.copy(anchor3D.getWorldPosition());
        this.el.object3D.rotation.copy(anchor3D.getWorldRotation());
        this.el.object3D.visible = true;
        this.turnInvisibleAfter = time + this.data.timeout;
    }
});

AFRAME.registerPrimitive('a-arcube', {
    defaultComponents: {
        'arcube': {},
    },

    mappings: {
        enabled: 'arcube.enabled',
        scale: 'arcube.scale',
        timeout: 'arcube.timeout',
    },
});
