// FOR FUTURE USE IF NEEDED
export const ROLE_CONFIG = {
    super_admin: {
        api: "/api/users/register/superAdmin",
        fields: [
            { name: "name", type: "text", placeholder: "Name", required: true },
            { name: "email", type: "email", placeholder: "Email", required: true },
            { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
        ],
    },
    admin: {
        api: "/api/users/register/admin",
        fields: [
            { name: "name", type: "text", placeholder: "Name", required: true },
            { name: "email", type: "email", placeholder: "Email", required: true },
            { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
            { name: "phone", type: "text", placeholder: "Phone", required: true },
        ],
    },
    restaurant_owner: {
        api: "/api/users/register/restaurant_owner",
        fields: [
            { name: "name", type: "text", placeholder: "Name", required: true },
            { name: "email", type: "email", placeholder: "Email", required: true },
            { name: "phone", type: "text", placeholder: "Phone", required: true },
            { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
            
        ],
    },
    office_admin: {
        api: "/api/users/register/office_admin",
        fields: [
            { name: "name", type: "text", placeholder: "Name", required: true },
            { name: "phone", type: "text", placeholder: "Phone", required: true },
            { name: "email", type: "email", placeholder: "Email", required: true },
            { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
            {
                name: "isVeg",
                type: "select",
                placeholder: "Meal Preference",
                required: true,
                options: [
                    { value: true, label: "Veg" },
                    { value: false, label: "Non-Veg" }
                ],
                defaultValue: true
            }
        ],
    },    
    office_staff: {
        api: "/api/users/register/office_staff",
        fields: [
            { name: "name", type: "text", placeholder: "Name", required: true },
            { name: "phone", type: "text", placeholder: "Phone", required: true },
            { name: "email", type: "email", placeholder: "Email", required: true },
            { name: "password", type: "password", placeholder: "Password", required: true, minLength: 6 },
            {
                name: "isVeg",
                type: "select",
                placeholder: "Meal Preference",
                required: true,
                options: [
                    { value: true, label: "Veg" },
                    { value: false, label: "Non-Veg" }
                ],
                defaultValue: true
            }
        ],
    },
};
