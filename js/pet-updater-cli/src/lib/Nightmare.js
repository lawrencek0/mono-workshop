import Nightmare from 'nightmare';
import realMouse from 'nightmare-real-mouse';
import upload from 'nightmare-upload';

realMouse(Nightmare);
upload(Nightmare);

Nightmare.action(
  'show',
  function(name, options, parent, win, renderer, done) {
    parent.respondTo('show', function(done) {
      win.show();
      done();
    });
    done();
  },
  function(done) {
    this.child.call('show', done);
  }
);

Nightmare.action(
  'hide',
  function(name, options, parent, win, renderer, done) {
    parent.respondTo('hide', function(done) {
      win.hide();
      done();
    });
    done();
  },
  function(done) {
    this.child.call('hide', done);
  }
);

export default Nightmare;
