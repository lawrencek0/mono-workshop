import Nightmare from 'nightmare';
import realMouse from 'nightmare-real-mouse';
import upload from 'nightmare-upload';

realMouse(Nightmare);
upload(Nightmare);

export default Nightmare;
