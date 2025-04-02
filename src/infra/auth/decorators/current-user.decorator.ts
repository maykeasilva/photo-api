import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { UserPayload } from '../jwt.strategy'

export const CurrentUser = createParamDecorator((_, context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user as UserPayload
})
