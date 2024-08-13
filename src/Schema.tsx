export const heroSchema = {
    title: 'hero schema',
    description: 'describes a simple hero',
    version: 3,
    primaryKey: 'name',
    type: 'object',
    properties: {
        
        name: {
            type: 'string',
            maxLength: 100
        },
        imageUrl: {
            type: 'string',
            maxLength: 100
        },
        city: {
            type: 'string',
            maxLength: 100
        },
        isEditable: {
            type: 'boolean'
        }
    },
    required: [
        'name',
        'imageUrl'
    ]
};
