import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<EntityProps> {
  private uniqueEntityID: UniqueEntityID
  protected props: EntityProps

  constructor(props: EntityProps, id?: UniqueEntityID) {
    this.uniqueEntityID = id ?? new UniqueEntityID()
    this.props = props
  }

  get id() {
    return this.uniqueEntityID
  }

  equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this.uniqueEntityID) {
      return true
    }

    return false
  }
}
