import * as GraphQL from "graphql";

// From: https://developer.github.com/v4/enum/orderdirection/
export const OrderDirection = new GraphQL.GraphQLEnumType({
    name: 'OrderDirection',
    description: 'Possible directions in which to order a list of items.',
    values: {
        ASC: {value: 'asc'},
        DESC: {value: 'desc'},
    },
});

//From: https://developer.github.com/v4/interface/node/
export const Node = new GraphQL.GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID.',
    fields: {
        id: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
            description: 'ID of the object.',
        },
    },
});

export const PageInfo = new GraphQL.GraphQLObjectType({
    name: 'PageInfo',
    description: '',
    fields: {
        hasNextPage: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean),
            description: 'When paginating forwards, are there more items?',
        },
        hasPreviousPage: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean),
            description: 'When paginating backwards, are there more items?',
        },
        startCursor: {
            type: GraphQL.GraphQLString,
            description: 'When paginating backwards, the cursor to continue.',
        },
        endCursor: {
            type: GraphQL.GraphQLString,
            description: 'When paginating forwards, the cursor to continue.',
        },
    },
});
