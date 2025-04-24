# Python version of the same multiplication table code
n = int(input("Enter a number (n): "))

for i in range(1, n + 1):
    print(f"Table of {i}:")
    for j in range(1, 11):
        print(f"{i} x {j} = {i * j}")
    print()
