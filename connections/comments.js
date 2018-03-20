import * as GraphQL from "graphql";
import {Node, OrderDirection, PageInfo} from "./common";

const CommentOrderField = new GraphQL.GraphQLEnumType({
    name: 'CommentOrderField',
    description: 'Properties by which comments can be ordered.',
    values: {
        ID: {value: 'id'},
        CREATED_AT: {value: 'createdAt'},
    },
});

export const CommentOrder = new GraphQL.GraphQLInputObjectType({
    name: 'CommentOrder',
    description: 'Ways in which lists of comments can be ordered upon return.',
    fields: {
        direction: {
            type: new GraphQL.GraphQLNonNull(OrderDirection),
            description: 'The direction in which to order comments by the specified field.',
        },
        field: {
            type: new GraphQL.GraphQLNonNull(CommentOrderField),
            description: 'The field in which to order commments by.',
        },
    }
});

export const CommentNode = new GraphQL.GraphQLObjectType({
    name: 'CommentNode',
    description: 'A comment made by a user.',
    interfaces: [
        Node,
    ],
    fields: {
        id: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
            description: 'The database ID of the comment.',
        },
        content: {
            type: GraphQL.GraphQLString,
            description: 'The body of the comment.',
        },
        createdAt: {
            type: GraphQL.GraphQLInt,
            description: 'Timestamp to seconds of when this comment was created.',
            resolve({createdAt}) {
                return new Date(createdAt).getTime() / 1000 | 0;
            },
        },
    },
});

const CommentEdge = new GraphQL.GraphQLObjectType({
    name: 'CommendtEdge',
    description: 'An edge in a connection.',
    fields: {
        cursor: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
            description: 'A cursor for use in pagination.',
        },
        node: {
            type: CommentNode,
            description: 'The item at the end of the edge.',
        },
    },
});

export default new GraphQL.GraphQLObjectType({
    name: 'CommentConnection',
    description: 'A list of comments made by the user.',
    fields: {
        edges: {
            type: new GraphQL.GraphQLList(CommentEdge),
            description: 'A list of edges.',
        },
        nodes: {
            type: new GraphQL.GraphQLList(CommentNode),
            description: 'A list of nodes.',
        },
        pageInfo: {
            type: new GraphQL.GraphQLNonNull(PageInfo),
            description: 'Information to aid in pagination.',
        },
        totalCount: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
            description: 'Identifies the total count of items in the connection.',
        },
    }
});
