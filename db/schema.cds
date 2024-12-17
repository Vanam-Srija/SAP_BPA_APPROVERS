namespace my.orders;

entity Orders {
    key requestID : UUID;          
    requestBy     : String(100);    
    totalPrice    : Decimal(10, 2); 
    status        : String(20);     
}

entity Approvals {
    key approvalID : UUID;          
    requestID      : Association to Orders;          
    approver       : String(100);  
    decision       : String(20);    
    decisionTime   : Timestamp;    
}

entity Approvers {
    key ID            : UUID;       // Unique identifier for the approver
    email             : String;     // Email of the approver
    name              : String;     // Name of the approver
    approvalValue     : Integer;    // Maximum value the approver can approve
}

entity OrderHistory {
    key historyID : UUID;           // Unique identifier for the order history entry
    requestID     : Association to Orders;          // Reference to the order's request ID
    status        : String(20);     // The updated status of the order
    updatedAt     : Timestamp;      // Timestamp of the status update
}




// namespace my.order;

// entity Orders {
//     key ID: UUID;
//     requestId: String(20);
//     requestBy: String;
//     requestItem: String;
//     totalPrice: Decimal(10, 2); 
//     status: String enum {
//         Pending;
//         Approved;
//         Rejected;
//     };
//     approver1Decision: String enum {
//         None;
//         Approved;
//         Rejected;
//     } default 'None';
//     approver2Decision: String enum {
//         None;
//         Approved;
//         Rejected;
//     } default 'None';
// }
