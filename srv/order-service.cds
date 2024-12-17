namespace my.orders;

using { my.orders as db } from '../db/schema';

service OrderService @(path: '/api/v1') {
    entity Orders as projection on db.Orders;
    entity Approvals as projection on db.Approvals;
    entity Approvers as projection on db.Approvers;
    entity OrderHistory as projection on db.OrderHistory;
    action approveOrder(requestID: UUID, requestBy: String, totalPrice: Decimal(10, 2)) returns String;
}

/* namespace my.orders;

using { my.orders as db } from '../db/schema';

service OrderService @(path: '/api/v1') {
    entity Orders as projection on db.Orders;
    entity Approvals as projection on db.Approvals;
    entity Approvers as projection on db.Approvers;
    //entity OrderHistory as projection on db.OrderHistory;

    action approveOrder(requestID: UUID, requestBy: String, totalPrice: Decimal(10, 2)) returns String;
} */
