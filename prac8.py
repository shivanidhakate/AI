 
import networkx as nx 
import matplotlib.pyplot as plt 
 
class SemanticNetwork: 
    def __init__(self): 
        self.network = [] 
 
    def add_fact(self, subject, relation, obj): 
        self.network.append((subject, relation, obj)) 
 
    def display_network(self): 
        if not self.network: 
            print("No facts in the network.") 
        else: 
            print("\nCurrent Semantic Network:") 
            for fact in self.network: 
                print(f"{fact[0]} {fact[1]} {fact[2]}") 
 
    def draw_graph(self): 
        if not self.network: 
            print("No facts to display in graph.") 
            return 
         
        G = nx.DiGraph() 
 
        # Add edges with labels 
        for subject, relation, obj in self.network: 
            G.add_edge(subject, obj, label=relation) 
 
        pos = nx.spring_layout(G)  # layout for better visualization 
         
        plt.figure(figsize=(8, 6)) 
         
        # Draw nodes and edges 
        nx.draw(G, pos, with_labels=True, node_color='lightblue', 
                node_size=2000, font_size=10, font_weight='bold') 
 
        # Draw edge labels (relations) 
        edge_labels = nx.get_edge_attributes(G, 'label') 
        nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels) 
 
        plt.title("Semantic Network Graph") 
        plt.show() 
 
def main(): 
    semantic_network = SemanticNetwork() 
    
 
    while True: 
        print("\nMenu:") 
        print("1. Add a new fact") 
        print("2. Display all facts") 
        print("3. Show graph") 
        print("4. Exit") 
        
        choice = input("Enter your choice (1-4): ") 
        
        if choice == '1': 
            try: 
                num_facts = int(input("How many facts do you want to enter? ")) 
            except ValueError: 
                print("Please enter a valid number.") 
                continue 
            
            for i in range(num_facts): 
                print(f"\nFact {i + 1}:") 
                subject = input("Enter subject: ") 
                relation = input("Enter relation: ") 
                obj = input("Enter object: ") 
                semantic_network.add_fact(subject, relation, obj) 
        
        elif choice == '2': 
            semantic_network.display_network() 
 
        elif choice == '3': 
            semantic_network.draw_graph() 
        
        elif choice == '4': 
            print("Exiting the program.") 
            break 
        
        else: 
            print("Invalid choice. Please try again.") 
 
if __name__ == "__main__": 
    main() 
