// @TODO: need to extract types and make it DRY
const rules = {
    visitor: {
        static: ['login'],
    },
    student: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'logout'],
    },
    faculty: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'logout'],
    },
    admin: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'logout'],
    },
};

export { rules as rbacRules };
