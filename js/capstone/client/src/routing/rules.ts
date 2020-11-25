// @TODO: need to extract types and make it DRY
const rules = {
    visitor: {
        static: ['login'],
    },
    student: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'groups:visit', 'groups:create', 'logout'],
    },
    faculty: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'groups:visit', 'groups:create', 'logout'],
    },
    admin: {
        static: ['dashboard:visit', 'events:visit', 'events:add', 'groups:visit', 'groups:create', 'logout'],
    },
};

export { rules as rbacRules };
