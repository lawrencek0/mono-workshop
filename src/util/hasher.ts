import Hashids from 'hashids/cjs'; //...
import { salt } from './secrets';

const hashids = new Hashids(salt, 8);

export default hashids;
