import 'vue-router'
import { routeNames } from '@/router/route-names'
import { globalProperties, portalNames } from '@/plugins'
import { EElComponentSize, EElComponentType } from '@/types/enums'

declare module 'vue-router' {
  interface RouteMeta {
    label?: string
    parentName?: string
    requireAuth?: boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $portalNames: typeof portalNames
    $routeNames: typeof routeNames

    // todo: These ones are used only for element library for size and type props;
    $elComponentSize: typeof EElComponentSize
    $elComponentType: typeof EElComponentType
  }
}

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
  }
}

export { }
