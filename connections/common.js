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
    description: '',
    fields: {
        id: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
        },
    },
});

export const PageInfo = new GraphQL.GraphQLObjectType({
    name: 'PageInfo',
    description: '',
    fields: {
        hasNextPage: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean),
        },
        hasPreviousPage: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean),
        },
        startCursor: {
            type: GraphQL.GraphQLString,
        },
        endCursor: {
            type: GraphQL.GraphQLString,
        },
    },
});
