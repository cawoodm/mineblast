export function Controls(game) {
  return {
    swipeStart(e) {
      if (!this.state.running) return;
      if (!e.touches) return;
      this.state.swipeX = e.touches[0].clientX;
    },
    swipeEnd() {
      if (this.state.swipeX !== null) game.shoot();
    },
    swipeMove(e) {
      if (!this.state.running) return;
      if (!e.touches) return;
      if (this.state.swipeX === null) return;
      let deltaX = e.touches[0].clientX - this.state.swipeX;
      if (deltaX > 8) this.player.right();
      else if (deltaX < -8) this.player.left();
      this.state.swipeX = null;
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
