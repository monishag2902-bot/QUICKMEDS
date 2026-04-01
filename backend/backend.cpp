#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <fstream>
#include <climits>
using namespace std;

/* ===================== STRUCTURES ===================== */

struct User {
    string name;
    string email;
    string password;
};

struct Medicine {
    string name;
    int quantity;
    float price;
};

struct Pharmacy {
    string name;
    int id;
    vector<Medicine> medicines;
};

struct Driver {
    int id;
    string name;
};

struct Order {
    int id;
    string user;
    string medicine;
    int pharmacyId;
    int driverId;
    string status;
};

/* ===================== GLOBAL DATA ===================== */

vector<User> users;
vector<Pharmacy> pharmacies;
vector<Driver> drivers;
vector<Order> orders;

/* ===================== FILE HANDLING ===================== */

void saveUsers() {
    ofstream f("users.txt");

    for (int i = 0; i < users.size(); i++) {
        f << users[i].name << " "
          << users[i].email << " "
          << users[i].password << endl;
    }
}

void loadUsers() {
    users.clear();

    ifstream f("users.txt");
    if (!f) return;

    User u;
    while (f >> u.name >> u.email >> u.password) {
        users.push_back(u);
    }
}

/* ===================== USER MODULE ===================== */

void registerUser(string name, string email, string password) {
    users.push_back({name, email, password});
    saveUsers();
}

bool loginUser(string email, string password) {
    for (int i = 0; i < users.size(); i++) {
        if (users[i].email == email && users[i].password == password) {
            return true;
        }
    }
    return false;
}

/* ===================== PHARMACY MODULE ===================== */

void addPharmacy(string name) {
    Pharmacy p;
    p.name = name;
    p.id = pharmacies.size();
    pharmacies.push_back(p);
}

bool addMedicine(int pid, string name, int qty, float price) {
    if (pid >= 0 && pid < pharmacies.size()) {
        pharmacies[pid].medicines.push_back({name, qty, price});
        return true;
    }
    return false;
}

/* ===================== SEARCH (Binary Search) ===================== */

bool binarySearch(vector<string>& meds, string target) {
    sort(meds.begin(), meds.end());

    int low = 0, high = meds.size() - 1;

    while (low <= high) {
        int mid = (low + high) / 2;

        if (meds[mid] == target)
            return true;
        else if (meds[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return false;
}

string searchMedicine(string med) {

    if (pharmacies.size() == 0) {
        return "No Pharmacy Available";
    }

    vector<string> all;

    for (int i = 0; i < pharmacies.size(); i++) {
        for (int j = 0; j < pharmacies[i].medicines.size(); j++) {
            all.push_back(pharmacies[i].medicines[j].name);
        }
    }

    if (all.size() == 0) {
        return "No Medicines Available";
    }

    if (binarySearch(all, med)) {
        return "Medicine Found";
    } else {
        return "Not Found";
    }
}

/* ===================== MAIN ===================== */

int main() {
    loadUsers();

    string command;
    cin >> command;

    /* USER */
    if (command == "register") {
        string n, e, p;
        cin >> n >> e >> p;

        registerUser(n, e, p);
        cout << "User Registered\n";
    }

    else if (command == "login") {
        string e, p;
        cin >> e >> p;

        if (loginUser(e, p)) {
            cout << "Login Success\n";
        } else {
            cout << "Invalid\n";
        }
    }

    /* PHARMACY */
    else if (command == "addPharmacy") {
        string name;
        cin >> name;

        addPharmacy(name);
        cout << "Pharmacy Added\n";
    }

    else if (command == "addMedicine") {
        int pid, qty;
        float price;
        string name;

        cin >> pid >> name >> qty >> price;

        if (addMedicine(pid, name, qty, price)) {
            cout << "Medicine Added\n";
        } else {
            cout << "Invalid Pharmacy ID\n";
        }
    }

    /* SEARCH */
    else if (command == "search") {
        string med;
        cin >> med;

        cout << searchMedicine(med) << endl;
    }

    else {
        cout << "Invalid Command\n";
    }

    return 0;
}