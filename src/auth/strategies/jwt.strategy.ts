import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
        _configService: ConfigService 
    ){
        super({
            secretOrKey: _configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    /**
     * * Validación del token
     */
    async validate(payload: JwtPayload): Promise<User> {

        /**
         * * Validamos que el email exista en la DB
         */
        const {id} = payload;

        const user = await this._userRepository.findOneBy({id});

        if(!user) throw new UnauthorizedException('Token not valid');

        if(!user.isActive) throw new UnauthorizedException('User inactive');

        /**
         * * Si el codigo pasa hasta este punto, el user retornado se agrega a la request
         */
        return user;
    }

}