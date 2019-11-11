import { JsonController, Get, QueryParam } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserRepository } from './repository';
import { Role } from './entity/User';

@JsonController('/users')
export class UserController {
    @Inject() private repository: UserRepository;

    // @FIXME: need more security!
    @Get('/')
    async findAllByRole(@QueryParam('role') role: Role) {
        return this.repository.findAllByRole(role);
    }
}
