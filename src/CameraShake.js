import {Vector3} from 'three';
export function CameraShake() {
  return {
    // When a function outside ScreenShake handle the camera, it should
    // always check that ScreenShake.enabled is false before.
    enabled: false,
    timestampStart: undefined,
    timestampEnd: undefined,
    startPoint: undefined,
    endPoint: undefined,

    // update(camera) must be called in the loop function of the renderer,
    // it will repositioned the camera according to the requested shaking.
    update: function update(camera) {
      if (this.enabled == true) {
        const now = Date.now();
        if (this.timestampEnd > now) {
          let interval = (Date.now() - this.timestampStart) / (this.timestampEnd - this.timestampStart);
          this.computePosition(camera, interval);
        } else {
          camera.position.copy(this.startPoint);
          this.enabled = false;
        }
      }
    },

    // This initialize the values of the shaking.
    // vecToAdd param is the offset of the camera position at the climax of its wave.
    shake: function shake(camera, vecToAdd, milliseconds) {
      this.enabled = true;
      this.timestampStart = Date.now();
      this.timestampEnd = this.timestampStart + milliseconds;
      this.startPoint = new Vector3().copy(camera.position);
      this.endPoint = new Vector3().addVectors(camera.position, vecToAdd);
    },

    computePosition: function computePosition(camera, interval) {
      // This creates the wavy movement of the camera along the interval.
      // The first bloc call this.getQuadra() with a positive indice between
      // 0 and 1, then the second call it again with a negative indice between
      // 0 and -1, etc. Variable position will get the sign of the indice, and
      // get wavy.
      let position;
      if (interval < 0.4) {
        position = this.getQuadra(interval / 0.4);
      } else if (interval < 0.7) {
        position = this.getQuadra((interval - 0.4) / 0.3) * -0.6;
      } else if (interval < 0.9) {
        position = this.getQuadra((interval - 0.7) / 0.2) * 0.3;
      } else {
        position = this.getQuadra((interval - 0.9) / 0.1) * -0.1;
      }

      // Here the camera is positioned according to the wavy 'position' variable.
      camera.position.lerpVectors(this.startPoint, this.endPoint, position);
    },

    // This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
    // then return 0 when t=1 ;
    getQuadra: function getQuadra(t) {
      return 9.436896e-16 + 4 * t - 4 * (t * t);
    },
  };
}
