% Facts
male(arun).
male(manohar).

female(harsha).
female(shivani).
female(rutuja).
female(chatura).

% Parent relationships (Parent, Child)

% Arun and Harsha's children
parent(arun, shivani).
parent(arun, rutuja).
parent(harsha, shivani).
parent(harsha, rutuja).

% Manohar and Chatura's child
parent(manohar, arun).
parent(chatura, arun).

% Rules
father(X, Y) :- male(X), parent(X, Y).
mother(X, Y) :- female(X), parent(X, Y).

sibling(X, Y) :- parent(Z, X), parent(Z, Y), X \= Y.

grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
grandfather(X, Y) :- male(X), grandparent(X, Y).
grandmother(X, Y) :- female(X), grandparent(X, Y).

uncle(X, Y) :- male(X), sibling(X, Z), parent(Z, Y).
aunt(X, Y) :- female(X), sibling(X, Z), parent(Z, Y).

% Helper for the web system to print results with variable names
run_ai_query(Query, Bindings) :-
    (   call(Query)
    ->  (   Bindings = []
        ->  write('true.')
        ;   write_bindings(Bindings)
        ),
        nl
    ;   write('false.'), nl
    ).

write_bindings([]).
write_bindings([Name=Value|T]) :-
    write(Name), write(' = '), write(Value),
    (T = [] -> true ; write(', '), write_bindings(T)).
