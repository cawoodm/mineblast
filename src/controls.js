import {invlerp} from './common';
export function Controls(game) {
  return {
    swipeStart(e) {
      if (!this.state.running) return;
      if (!e.touches) return;
      this.state.swipe = {x: e.touches[0].clientX, y: e.touches[0].clientY};
    },
    swipeEnd() {
      if (this.state.swipe.x !== null) game.shoot();
    },
    swipeMove(e) {
      if (!this.state.running) return;
      if (!e.touches) return;
      if (this.state.swipe.x === null) return;
      let delta = {x: e.touches[0].clientX - this.state.swipe.x, y: e.touches[0].clientY - this.state.swipe.y};
      if (Math.abs(delta.y) > Math.abs(delta.x)) {
        // Mainly vertical swipe
        // console.log('Vertical', delta);
      } else {
        // Mainly horizontal swipe
        //console.log('Horizontal', delta.x);
        let xPower = Math.min(invlerp(0, 20, Math.abs(delta.x)), 1);
        if (delta.x > 4) this.player.right(xPower);
        else if (delta.x < 4) this.player.left(xPower);
      }
      this.state.swipe = {x: null, y: null};
    },
    // eslint-disable-next-line complexity
    keypress(e) {
      let res = null;
      if (!e.altKey && !e.ctrlKey) {
        if (['ArrowUp', 'KeyW'].includes(e.code)) res = game.shoot();
        else if (['ArrowLeft', 'KeyA'].includes(e.code)) res = this.player.left();
        else if (['ArrowRight', 'KeyD'].includes(e.code)) res = this.player.right();
        else if (e.code === 'KeyS') res = console.log(this.scene);
        else if (e.code === 'KeyP') res = game.pause();
        else if (e.code === 'KeyX') res = game.debug();
        else if (e.code === 'KeyO') res = game.toggleStats();
        else return;
      } else return;
      if (res === null) {
        e.preventDefault();
        // dp('Unhandled keypress', e);
      }
      return res;
    },
  };
}
