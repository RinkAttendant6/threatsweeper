import React from 'react';

interface State {
    error?: unknown;
}

export default class ErrorBoundary extends React.Component<unknown, State> {
    constructor(props: unknown) {
        super(props);
        this.state = { error: null };
    }

    public componentDidCatch(error: unknown): void {
        this.setState({ error });
        console.error(error);
    }

    public render() {
        if (this.state.error) {
            return <p>Something went wrong</p>;
        }

        return this.props.children;
    }
}
