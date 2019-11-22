// @TODO: need to extract types and make it DRY
const rules = {
    visitor: {
        static: ['login'],
    },
    student: {
        static: ['dashboard:visit', 'logout'],
    },
    faculty: {
        static: ['dashboard:visit', 'logout'],
    },
    admin: {
        static: ['dashboard:visit', 'logout'],
    },
};

export { rules as rbacRules };
