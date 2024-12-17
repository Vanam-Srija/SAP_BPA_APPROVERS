const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    const { Orders, Approvals, Approvers, OrderHistory } = srv.entities;

    srv.before('CREATE', Orders, (req) => {
        req.data.status = "In Progress";
    });

    srv.on('approveOrder', async (req) => {
        const { requestID, requestBy, totalPrice } = req.data;

        let order = await cds.run(SELECT.one.from(Orders).where({ requestID }));

        if (!order) {
            order = await cds.run(
                INSERT.into(Orders).entries({
                    requestID,
                    requestBy,
                    totalPrice,
                    status: "In Progress",
                })
            );
        }

        const approvers = await cds.run(SELECT.from(Approvers).where({ approvalValue: { '>=': totalPrice } }));

        if (approvers.length === 0) {
            req.error(404, `No approver found for the order with price ${totalPrice}`);
        }

        const approver = approvers[0];

        const decision = totalPrice <= approver.approvalValue ? "Approved" : "Rejected";

        await cds.run(
            INSERT.into(Approvals).entries({
                approvalID: cds.utils.uuid(),
                requestID,
                approver: approver.name,
                decision,
                decisionTime: new Date().toISOString(),
            })
        );

        await cds.run(UPDATE(Orders).set({ status: decision }).where({ requestID }));

        await cds.run(
            INSERT.into(OrderHistory).entries({
                historyID: cds.utils.uuid(),
                requestID,
                status: decision,
                updatedAt: new Date().toISOString(),
            })
        );

        return {
            message: `Order ID ${requestID} has been ${decision.toLowerCase()} by ${approver.name}`,
            orderDetails: order,
            approverDetails: approver,
        };
    });
});


/* const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    const { Orders, Approvals, Approvers, OrderHistory } = srv.entities;

    srv.before('CREATE', Orders, (req) => {
        req.data.status = "In Progress";
    });

    srv.on('approveOrder', async (req) => {
        const { requestID, requestBy, totalPrice } = req.data;

        let order = await cds.run(SELECT.one.from(Orders).where({ requestID }));
        
        if (!order) {
            order = await cds.run(
                INSERT.into(Orders).entries({
                    requestID,
                    requestBy,
                    totalPrice,
                    status: "In Progress",
                })
            );
        }

        // Retrieve the approver details who is eligible to approve or reject
        const approvers = await cds.run(SELECT.from(Approvers).where({ approvalValue: { '>=': totalPrice } }));

        if (approvers.length === 0) {
            req.error(404, `No approver found for the order with price ${totalPrice}`);
        }

        // Get the first approver that qualifies
        const approver = approvers[0];

        // Determine the decision based on the approver's approval value
        let decision = "Rejected"; // Default decision is Rejected
        if (totalPrice <= approver.approvalValue) {
            decision = "Approved"; // Approve if the order price is within the approver's limit
        }

        // Log the approval decision in the Approvals entity
        await cds.run(
            INSERT.into(Approvals).entries({
                approvalID: cds.utils.uuid(),
                requestID,
                approver: approver.name,
                decision,
                decisionTime: new Date().toISOString(),
            })
        );

        // Update the order status based on the decision
        if (decision === "Rejected") {
            await cds.run(UPDATE(Orders).set({ status: "Rejected" }).where({ requestID }));
            // Log the status change in OrderHistory
            await cds.run(
                INSERT.into(OrderHistory).entries({
                    historyID: cds.utils.uuid(),
                    requestID,
                    status: "Rejected",
                    updatedAt: new Date().toISOString(),
                })
            );
            return {
                message: `Order ID ${requestID} has been rejected by ${approver.name}`,
                orderDetails: order,
                approverDetails: approver,
            };
        }

        // Log the status change in OrderHistory
        await cds.run(
            INSERT.into(OrderHistory).entries({
                historyID: cds.utils.uuid(),
                requestID,
                status: "Approved",
                updatedAt: new Date().toISOString(),
            })
        );

        return {
            message: `Order ID ${requestID} has been approved by ${approver.name}`,
            orderDetails: order,
            approverDetails: approver,
        };
    });
});
 */