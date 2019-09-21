import Hashids from 'hashids/cjs'; //...
import { hashidSalt } from './secrets';

const hashids = new Hashids(hashidSalt, 8);

export default hashids;
