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
            },
            // type: Comment, based on GitHub's delete mutations return types
            deleteComment: {
                type: Comment,
                args: {
                    id: {
                        type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
                    },
                },
                async resolve(_, args) {
                    let model = await Database.models.comment.findById(args.id);
                    if(model) {
                        let count = await Database.models.comment.destroy({ where: args });
                        if(count > 0) {
                            return model;
                        } else {
                            throw new Error('Cant delete the record.');
                        }
                    } else {
                        throw new Error('The record doesn\'t exists or has already been deleted.')
                    }
                }
            }
        }
    }
});

const Schema = new GraphQL.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

export default Schema;
