import { registerEnumType } from 'type-graphql';

export enum OrderFilterType {
  none,
  reservations,
  purchases,
}

registerEnumType(OrderFilterType, {
  name: 'OrderFilter',
  description: 'All order filtering types',
});
