import csv
import json
import collections

# Known locations from script.js
KNOWN_LOCATIONS = {
    "אל קסום", "חורה", "כסיפה", "לקיה", "תל שבע", 
    "ערערה בנגב", "נווה מדבר", "רהט", "שגב שלום"
}

def process_csv(filename):
    flows = collections.defaultdict(int)
    unknown_locations = set()

    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader) # Skip header
        # Expected indices based on review:
        # Origin: 4
        # Destination: 5
        
        for row in reader:
            if not row: continue
            if len(row) < 6: continue
            
            origin = row[4].strip()
            destinations_str = row[5].strip()
            
            # Split destinations by comma
            # The CSV reader handles the quoted commas logic, but the field itself 
            # might contain "Place A, Place B".
            destinations = [d.strip() for d in destinations_str.split(',')]
            
            # Filter empty
            destinations = [d for d in destinations if d]
            
            # Clean origin
            if origin not in KNOWN_LOCATIONS:
                # heuristic: check if it's a known location with extra chars or just unknown
                if origin: unknown_locations.add(origin)
                # Maybe map 'Al Kasum' -> 'אל קסום' if needed, but for now just log
            
            for dest in destinations:
                if dest not in KNOWN_LOCATIONS:
                    if dest: unknown_locations.add(dest)
                
                # Count flow
                # Only count if both are valid (or decide what to do with unknown)
                # For now, let's include them in count to see what they are
                flows[(origin, dest)] += 1

    # Convert to list of dicts
    output_flows = []
    for (start, end), count in flows.items():
        if start in KNOWN_LOCATIONS and end in KNOWN_LOCATIONS:
            output_flows.append({
                "from": start,
                "to": end,
                "count": count
            })
    
    # Sort for consistent output
    output_flows.sort(key=lambda x: (x['from'], x['to']))
    
    return output_flows, unknown_locations

if __name__ == "__main__":
    csv_file = "EVENT-מספר העברות.csv"
    data, unknowns = process_csv(csv_file)
    
    print(json.dumps(data, ensure_ascii=False, indent=4))
    
    if unknowns:
        print("\n\nUNKNOWN LOCATIONS FOUND:")
        for u in unknowns:
            print(u)
