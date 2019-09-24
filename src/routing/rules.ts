// @TODO: need to extract types and make it DRY
const rules = {
    visitor: {
        static: ['login'],
    },
    student: {
        static: ['dashboard:visit', 'events:visit'],
    },
    faculty: {
        static: ['dashboard:visit', 'events:visit', 'events:add'],
    },
    admin: {
        static: ['dashboard:visit', 'events:visit', 'events:add'],
    },
};

export { rules as rbacRules };
