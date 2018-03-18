import Database from './database';
import * as GraphQL from 'graphql';

const Comment = new GraphQL.GraphQLObjectType({
    name: 'Comment',
    description: 'A comment made by a user.',
    fields() {
        return {
            id: {
                // Maybe GraphQLID too
                type: GraphQL.GraphQLString,
            },
            content: {
                type: GraphQL.GraphQLString,
            },
            createdAt: {
                // The use of GraphQLString was also evaluated
                type: GraphQL.GraphQLInt,
                resolve({createdAt}) {
                    return new Date(createdAt).getTime()/1000 | 0;
                },
            },
        }
    },
});

const Query = new GraphQL.GraphQLObjectType({
    name: 'Query',
    description: 'Entry endpoint.',
    fields() {
        return {
            comments: {
                type: new GraphQL.GraphQLList(Comment),
                args: {
                    id: {
                        type: GraphQL.GraphQLID,
                    },
                    createdAt: {
                        type: GraphQL.GraphQLString,
                    },
                },
                resolve(_, args) {
                    return Database.models.comment.findAll({where: args});
                },
            }
        }
    },
});

const Mutation = new GraphQL.GraphQLObjectType({
    name: 'Mutation',
    description: 'Queries that mutate things.',
    fields() {
        return {
            addComment: {
                type: Comment,
                args: {
                    content: {
                        type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
                    },
                },
                resolve(_, args) {
                    return Database.models.comment.create({
                        content: args.content,
                    });
                },
            }
        }
    }
});

const Schema = new GraphQL.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

export default Schema;
