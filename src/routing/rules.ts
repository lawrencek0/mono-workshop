// @TODO: need to extract types and make it DRY
const rules = {
    visitor: {
        static: ['login'],
    },
    student: {
        static: ['dashboard:visit'],
    },
    faculty: {
        static: ['dashboard:visit'],
    },
    admin: {
        static: ['dashboard:visit'],
    },
};

export { rules as rbacRules };
